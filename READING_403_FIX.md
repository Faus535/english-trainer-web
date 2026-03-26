# Fix: POST /api/reading/passages/{id}/answers devuelve 403

## Problema

El frontend llama a `POST /api/reading/passages/{textId}/answers` pero ese endpoint **no existe** en el backend. El backend tiene `POST /api/profiles/{userId}/reading/submit`.

Spring Security intercepta la request, no encuentra el endpoint, y devuelve **403** en lugar de 404 (comportamiento por defecto de Spring Security para endpoints autenticados inexistentes).

Ademas, el formato del body es diferente:

- **Frontend** envia: `{ answers: { "questionId": optionIndex } }` (Record<string, number>)
- **Backend** espera: `{ passageId: UUID, answers: [0, 1, 2, ...] }` (lista ordenada de indices)

## Solucion

### Fase 1: Backend - Crear endpoint que coincida con el frontend

Crear un nuevo controller que exponga `POST /api/reading/passages/{textId}/answers` aceptando el formato que envia el frontend.

**Archivo a crear:**

- `reading/infrastructure/controller/SubmitPassageAnswersController.java`

```
POST /api/reading/passages/{textId}/answers
Body: { "answers": { "questionId1": 0, "questionId2": 1 } }
Response: { "textId": "...", "score": 85.0, "totalQuestions": 5, "correctAnswers": 4 }
```

El controller debe:

1. Recibir `textId` como @PathVariable
2. Recibir `answers` como `Map<String, Integer>` (questionId -> opcion seleccionada)
3. Extraer el userId del JWT (Authentication principal)
4. Delegar al use case existente (`SubmitReadingAnswersUseCase`)

**Alternativa**: Modificar el controller existente para aceptar ambas rutas. Pero es mas limpio crear uno nuevo siguiendo el patron "one controller per action".

### Fase 2: Backend - Adaptar el use case si es necesario

Verificar que `SubmitReadingAnswersUseCase` puede trabajar con el formato `Map<String, Integer>` o crear un adaptador que convierta del formato del frontend al formato del use case.

**Archivos a revisar/modificar:**

- `reading/application/SubmitReadingAnswersUseCase.java` - Verificar firma del metodo `execute()`
- Si el use case espera `List<Integer>` ordenada, hay que mapear el `Map<String, Integer>` a la lista correcta

### Fase 3: Verificar CORS en produccion

El frontend en produccion esta en `https://front-end-production-3c06.up.railway.app`. Verificar que esta origin esta en `CORS_ALLOWED_ORIGINS` del backend en Railway.

**Archivo a revisar:**

- `shared/infrastructure/config/CorsConfig.java`
- Variable de entorno `CORS_ALLOWED_ORIGINS` en Railway

Si no esta configurada, la request sera rechazada por CORS antes de llegar al endpoint (tambien se manifiesta como error en el navegador).

## Orden de ejecucion

```
Fase 1 (Crear endpoint)  ← Fix principal, resuelve el 403
Fase 2 (Adaptar use case) ← Solo si el formato no es compatible
Fase 3 (Verificar CORS)   ← Independiente, hacer en paralelo
```

## Nota

No se necesitan cambios en el frontend. El frontend ya envia el JWT correctamente via `authInterceptor` y la URL que usa (`/api/reading/passages/{id}/answers`) es mas RESTful que la del backend actual.
