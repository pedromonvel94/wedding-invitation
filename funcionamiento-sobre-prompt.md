# Corrección de la animación del sobre y de la invitación

Necesito que corrijas completamente la implementación actual de la apertura del sobre. **No quiero simplemente ajustar la animación existente**; la estructura y el comportamiento visual deben representar correctamente cómo se abre un sobre físico real.

## 1. Estructura visual correcta

El componente debe representar un sobre real compuesto conceptualmente por:

1. **Cuerpo del sobre**

   * Es la parte inferior/principal del sobre.
   * Contiene la invitación en su interior.
   * Tiene como textura/fondo interno `envelope_inside_texture.png`.
   * Esta textura representa **ÚNICAMENTE el interior del sobre**.
   * NO debe utilizarse como fondo de la invitación.

2. **Tapa del sobre**

   * Es la solapa superior del sobre.
   * Debe estar visualmente conectada al cuerpo del sobre.
   * No debe parecer una pieza independiente flotando.
   * Debe comportarse como una solapa físicamente unida al borde superior del cuerpo.

3. **Invitación / carta**

   * Es una pieza completamente independiente del sobre.
   * Debe parecer una carta que está físicamente dentro del sobre.
   * Debe salir desde el interior del sobre.
   * Debe utilizar **los colores, estilos y diseño definidos para la invitación**, NO `envelope_inside_texture.png`.
   * `envelope_inside_texture.png` no debe aparecer como fondo de la carta bajo ninguna circunstancia.

---

# 2. Comportamiento físico de la apertura

La animación actual se ve extremadamente antinatural porque la tapa parece separarse del cuerpo del sobre.

Quiero que pienses en la animación como si tuviéramos un **sobre físico real sobre una mesa**.

### Estado inicial

El sobre está cerrado:

```text
       _________
      /         \
     /   TAPA    \
    /_____________\
    |             |
    |   SOBRE     |
    |             |
    |_____________|
```

La invitación está dentro del sobre y parcialmente oculta.

### Durante la apertura

La tapa NO debe desprenderse ni rotar como una pieza independiente.

Debe funcionar como una **solapa articulada en el borde superior del cuerpo del sobre**.

La solapa debe abrirse hacia arriba, manteniendo visualmente su conexión con el cuerpo.

Conceptualmente:

```text
          TAPA
          ↑
          │
          │
          │
          │
     ┌────┘
     │
     │ CUERPO
     │ DEL
     │ SOBRE
     │
     └────────
```

Es decir:

* La tapa permanece pegada al cuerpo.
* El punto de unión entre tapa y cuerpo permanece fijo.
* La tapa rota alrededor de ese punto de unión.
* No debe trasladarse independientemente.
* No debe parecer que estamos moviendo una tarjeta encima de otra.
* No debe haber separación visible entre la tapa y el cuerpo.
* Debe sentirse como una única pieza física articulada.

**La tapa simplemente se abre hacia arriba.**

---

# 3. Movimiento simultáneo del cuerpo y de la invitación

Este punto es MUY importante.

Cuando comienza la apertura:

### El cuerpo del sobre debe bajar

El cuerpo del sobre debe desplazarse progresivamente hacia abajo.

No debe quedarse estático mientras solamente la tapa se mueve.

### La invitación debe subir

Al mismo tiempo, la carta/invitación debe comenzar a salir desde dentro del sobre y desplazarse hacia arriba.

Por lo tanto, durante la animación existen dos movimientos principales:

```text
CUERPO DEL SOBRE
        ↓
        ↓
        ↓


INVITACIÓN
        ↑
        ↑
        ↑
```

Estos movimientos deben ocurrir **simultáneamente y coordinados**, dando la sensación de que la carta está saliendo físicamente del sobre.

---

# 4. La invitación debe terminar ocupando la pantalla

La carta no debe simplemente subir unos pocos píxeles.

Al finalizar la animación:

* La invitación debe haber salido completamente del sobre.
* Debe quedar centrada.
* Debe expandirse/adaptarse hasta ocupar correctamente toda la pantalla disponible del dispositivo.
* El usuario debe terminar viendo la invitación como el contenido principal de la pantalla.
* El sobre debe quedar fuera de la composición visual principal o completamente oculto debajo de la invitación, dependiendo de la estructura actual del diseño.

La transición debe sentirse como:

```text
SOBRE CERRADO
      ↓
SOBRE ABRIÉNDOSE
      ↓
CARTA SALIENDO
      ↓
CARTA SUBIENDO
      ↓
CARTA OCUPA LA PANTALLA
```

No quiero un simple `translateY()` de una imagen independiente.

Quiero que visualmente parezca que **una carta está saliendo de un sobre real**.

---

# 5. Jerarquía de capas (z-index)

La composición debe respetar la física del objeto.

Inicialmente:

```text
        TAPA
          ↓
   ┌───────────────┐
   │               │
   │  INVITACIÓN   │
   │   (oculta)    │
   │               │
   └───────────────┘
       CUERPO
```

La invitación debe comenzar detrás de la parte frontal del sobre.

A medida que sube:

```text
       TAPA ABIERTA
          ↑
          ↑
    ┌─────────────┐
    │ INVITACIÓN  │
    │             │
    │             │
    └─────────────┘
          ↑
      CUERPO BAJA
```

La carta debe pasar progresivamente por encima del cuerpo del sobre conforme sale.

No debe aparecer mágicamente por encima del sobre desde el primer frame.

---

# 6. `envelope_inside_texture.png`

Esto debe quedar completamente claro:

`envelope_inside_texture.png` **NO ES EL FONDO DE LA INVITACIÓN.**

Por el nombre del archivo y por su función, representa:

> La textura de la parte interna del sobre.

Por lo tanto:

```text
envelope_inside_texture.png
        ↓
INTERIOR DEL SOBRE
```

NO:

```text
envelope_inside_texture.png
        ↓
FONDO DE LA INVITACIÓN ❌
```

La invitación debe utilizar su propio diseño visual, con los colores y estilos que ya habíamos definido anteriormente.

Si actualmente el código está utilizando `envelope_inside_texture.png` como background de la invitación, **elimínalo de ahí**.

---

# 7. La tapa NO debe parecer una pieza independiente

Este es uno de los problemas visuales más importantes de la implementación actual.

Actualmente la animación hace que parezca algo parecido a:

```text
   ─────────
      ↑
   pieza 1

   ─────────
   pieza 2
```

Eso NO es lo que quiero.

Debe parecer:

```text
       /\
      /  \
     /    \
    /      \
   └────────┐
            │
            │
            │
            │
            └──────
```

La tapa y el cuerpo forman parte del mismo sobre.

La tapa está unida al cuerpo mediante su borde superior y únicamente cambia su ángulo de apertura.

**No debe desplazarse verticalmente como una pieza independiente.**

---

# 8. Referencia física que debes utilizar

Antes de implementar la animación, piensa literalmente en esta acción:

> Tengo un sobre físico cerrado sobre una mesa. Lo sostengo por el cuerpo. Levanto la solapa superior. La solapa sigue unida al borde del sobre. Mientras el sobre se abre, saco una carta desde dentro. La carta sube y sale del sobre. Finalmente sostengo la carta completamente abierta frente a mí.

Quiero que la animación digital reproduzca exactamente esa sensación.

No quiero:

* Una tapa flotando.
* Una tapa que se separa del cuerpo.
* Dos imágenes independientes moviéndose.
* Una carta que aparece mágicamente.
* Una carta que utiliza la textura del interior del sobre.
* Un sobre que simplemente rota.
* Una transición genérica de `translateY`.
* Una animación que parezca un elemento HTML entrando y saliendo.

Quiero una representación visual convincente de un **sobre físico que se abre y de una carta que sale de él**.

---

# 9. Requisitos de implementación

Revisa primero la implementación actual y determina qué elementos/componentes representan:

* cuerpo del sobre
* tapa/solapa
* interior del sobre
* invitación
* animación de apertura

Si la estructura actual impide conseguir este comportamiento correctamente, **reestructura los componentes y/o las capas CSS en lugar de intentar parchear la animación existente**.

La animación debe ser responsive y funcionar correctamente tanto en desktop como en dispositivos móviles.

Además:

* No rompas el diseño existente de la invitación.
* No cambies innecesariamente los colores de la invitación.
* No reutilices la textura interna del sobre como background de la carta.
* Mantén la invitación como un elemento independiente.
* Mantén la tapa físicamente conectada al cuerpo.
* Usa un punto de transformación (`transform-origin`) coherente con el borde donde realmente estaría unida la solapa.
* La apertura de la tapa debe ser suave y natural.
* El movimiento del cuerpo hacia abajo y de la carta hacia arriba debe estar coordinado.
* La animación debe tener easing natural, evitando movimientos mecánicos o robóticos.

## Resultado esperado

La experiencia completa debe sentirse así:

**Sobre cerrado → tapa se levanta desde su propia bisagra → cuerpo baja → carta comienza a salir → carta sube progresivamente → carta ocupa toda la pantalla → usuario queda viendo la invitación.**

La prioridad absoluta es que la animación **se vea físicamente natural**.

Si para conseguirlo es necesario modificar la estructura HTML/React, CSS, stacking contexts, `transform-origin`, `z-index`, posiciones absolutas o la secuencia de animación, hazlo.

No intentes preservar una implementación incorrecta únicamente porque ya existe. **Corrige la estructura para que el comportamiento visual sea correcto.**
