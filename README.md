# Proyecto Base: Pruebas End to End con Kraken

[Kraken](https://github.com/TheSoftwareDesignLab/Kraken) (`kraken-node`) es una herramienta de
pruebas E2E basada en escenarios escritos en [Gherkin](https://cucumber.io/docs/gherkin/) y
ejecutados con Cucumber.js. Su particularidad es que un mismo escenario puede tener **varios
usuarios** (navegadores web o dispositivos Android) que se coordinan enviándose señales, lo que
permite probar interacciones entre usuarios.

Este módulo contiene la configuración base de Kraken y un ejemplo con dos usuarios web que pueden
usar como punto de partida para las pruebas del proyecto.

## Requisitos

- Node.js 24 (`lts/krypton`). El módulo incluye un `.nvmrc`, por lo que pueden usar `nvm use`.
- npm (incluido con Node.js).
- **Google Chrome** instalado: Kraken abre el Chrome del sistema (no descarga un navegador).
- Solo para escenarios con usuarios `@mobile` (Android): Android SDK con `adb` y `aapt`, Appium,
  Java, y las variables `ANDROID_HOME` y `JAVA_HOME`. Revisen el entorno con
  `npx kraken-node doctor` desde la carpeta del módulo. Los escenarios web **no** necesitan nada de
  esto.

## Instalación

Desde la **raíz del repositorio** del proyecto:

```bash
npm run kraken:install
```

`kraken:prepare` existe por consistencia con los demás módulos, pero no hace nada.

> [!IMPORTANT]
> Instalen siempre desde la raíz. A diferencia de los demás módulos, Kraken se instala en el
> `node_modules` raíz (sin aislamiento), porque `kraken-node` necesita encontrar allí paquetes que no
> declara como dependencias.

## Ejecución

| Acción | Desde la raíz | Desde `e2e/misw-4103-kraken` |
|---|---|---|
| Ejecutar todos los escenarios de `features/` | `npm run kraken:test` | `npm test` |

`kraken:ui` ejecuta exactamente lo mismo: Kraken siempre abre las ventanas de Chrome (no tiene modo
headless), una por cada usuario web del escenario.

Los scripts usan `run-kraken.cjs`, que inicia `kraken-node run` y además:

- Permite ejecutar escenarios web sin `adb` (`kraken-node` 1.0.24 lo exige incluso cuando no hay
  usuarios Android). Los escenarios con usuarios `@mobile` se detienen con un mensaje claro si falta
  `adb`.
- Crea los archivos de coordinación de `.kraken/` sin vaciarlos, para que los usuarios que terminan
  al mismo tiempo no borren la marca de los demás.
- Agrega las variables `ABP_*` del `.env` del repositorio a los valores de `properties.json` (ver
  [Configuración](#configuración)).

## Estructura

```plaintext
misw-4103-kraken/
├── .nvmrc
├── package.json
├── run-kraken.cjs                      # lanzador de kraken-node (ver arriba)
├── abp.cjs                             # lee la configuración de la aplicación bajo pruebas (.env)
├── properties.json                     # valores propios para los escenarios (<FIRSTNAME>, …)
├── mobile.json                         # datos del APK para usuarios @mobile (requerido aunque no se use)
└── features/
    ├── tutorial.feature                # ejemplo incluido
    ├── web/
    │   ├── step_definitions/step.js    # pasos propios para web
    │   └── support/                    # hooks (abre Chrome por usuario) y configuración de Cucumber
    └── mobile/
        ├── step_definitions/step.js    # pasos propios para Android (vacío)
        └── support/
```

Los reportes quedan en `reports/` y los archivos de trabajo de Kraken en `.kraken/` (ambos en el
`.gitignore`).

## Configuración

- **Escenarios** (`features/*.feature`): cada escenario se etiqueta con el usuario y su tipo, por
  ejemplo `@user1 @web` y `@user2 @web`. Kraken ejecuta en paralelo los escenarios de los distintos
  usuarios de un mismo archivo.
- **Valores de los pasos** (sintaxis `"<NOMBRE>"`): la URL y el administrador de la aplicación bajo
  pruebas (ABP) vienen del archivo `.env` de la raíz del repositorio, el mismo que usa
  `npm run abp:up` para desplegar Ghost, y se usan sin copiarlos en el módulo:

  ```gherkin
  Given I navigate to page "<ABP_URL>/ghost/"
  When I enter email "<ABP_ADMIN_EMAIL>"
  ```

  Las variables disponibles son `ABP_URL`, `ABP_RC_URL` (la versión de Ghost para regresión visual),
  `ABP_ADMIN_NAME`, `ABP_ADMIN_EMAIL` y `ABP_ADMIN_PASSWORD`; `abp.cjs` las lee y `run-kraken.cjs`
  las agrega a las de `properties.json`, donde van los demás valores que necesiten. Si un nombre está
  en los dos, se usa el del `.env`. Fuera de un repositorio del proyecto (sin `.env`) se usan los
  valores por defecto de `abp.cjs`.
- **`mobile.json`**: ruta, paquete y actividad del APK para usuarios `@mobile`. Con `"type":
  "multiple"` se puede definir un APK por usuario.
- **Pasos**: Kraken ya trae pasos genéricos (navegar, esperar, enviar y esperar señales, entre
  otros); los pasos propios van en `features/web/step_definitions/step.js` y usan `this.driver`
  (WebdriverIO).
- **Tiempo máximo por paso**: 120 s (`setDefaultTimeout` en `features/*/support/support.js`); debe
  ser mayor que la espera más larga de los pasos de señales.

## Ejemplo incluido

`features/tutorial.feature` usa el demo
[angular-6-registration-login-example](https://angular-6-registration-login-example.stackblitz.io)
alojado en StackBlitz, no la ABP: muestra cómo usar las credenciales del `.env` sin resolver las
pruebas del proyecto. Dos usuarios web, cada uno en su propio Chrome:

1. Abren la página de registro e inician el proyecto en StackBlitz.
2. Se registran con el nombre de `properties.json` (`<FIRSTNAME>`, `<LASTNAME>`) y el correo (como
   usuario) y la contraseña del `.env` (`<ABP_ADMIN_EMAIL>`, `<ABP_ADMIN_PASSWORD>`).
3. Cada uno envía una señal al otro ("user1 registered" / "user2 registered") y espera la del otro
   (hasta 60 s).
4. Inician sesión y verifican el mensaje "Hi Monitor!".

## Solución de problemas

- **`adb: not found` / `Command failed: adb devices -l`**: ejecutaron `kraken-node run` directamente;
  usen `npm test` (o `npm run kraken:test`), que pasa por `run-kraken.cjs`.
- **Todos los pasos pasan pero el `After` falla por tiempo (`not all devices were ready to finish`)**:
  si ejecutaron `kraken-node run` directamente, usen `npm test`. Si pasa con `npm test`, revisen que
  todos los usuarios del escenario lleguen al final (por ejemplo, que ninguno espere una señal que
  nunca llega).
- **`Este escenario tiene usuarios @mobile y no se encontró 'adb'`**: el escenario necesita Android;
  instalen los requisitos móviles (ver Requisitos) o etiqueten los usuarios como `@web`.
- **No abre Chrome o falla al iniciar el navegador**: verifiquen que Google Chrome esté instalado. En
  Linux sin Chrome pueden indicar otro Chromium con la variable `CHROME_PATH`.
- **`Function timed out, ensure the promise resolves within 120000 milliseconds`**: un paso tardó más
  de lo permitido; revisen las esperas o aumenten `setDefaultTimeout`.
- **Advertencia `EBADENGINE`**: están usando una versión de Node.js anterior a la 24.

## Referencias

- [Kraken (TheSoftwareDesignLab)](https://github.com/TheSoftwareDesignLab/Kraken)
- [kraken-node en npm](https://www.npmjs.com/package/kraken-node)
- [Gherkin](https://cucumber.io/docs/gherkin/reference/) y [WebdriverIO](https://webdriver.io/docs/api)
