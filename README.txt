JC Nutrition V8.6 - Reajuste dinámico

Base: V8.5.

Novedades:
- Cada comida puede estar: Pendiente / Realizada / Saltada.
- “Saltar comida” elimina esa comida del plan proyectado del día.
- Al saltar o restaurar una comida se abre una nueva propuesta de reajuste.
- “Recalcular resto del día” está siempre disponible y puede usarse ilimitadamente.
- El motor trabaja siempre con el estado actual:
  consumido real + Extras/comidas libres + comidas saltadas + comidas pendientes.
- Si vas por encima del objetivo reduce solo comidas pendientes.
- Si, por ejemplo, saltas la merienda y quedas por debajo, puede volver a aumentar cantidades de la cena pendiente.
- Nunca modifica comidas ya realizadas ni comidas saltadas.
- Prioridad al recortar: grasas añadidas -> hidratos densos -> fruta -> proteína.
- Al aumentar: prioriza proteína si falta, después hidratos, y evita forzar comida de forma agresiva.
- La propuesta siempre requiere confirmación antes de aplicarse.
- Pendientes aparecen primero; saltadas después; realizadas al final.

Mantiene Rodilla y el resto de funciones de V8.5.
JavaScript validado con node --check.
