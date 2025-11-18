# To-Do List - Ionic + Angular + Firebase

Aplicación de gestión de tareas con categorías, filtros y feature flags remotos usando Firebase Remote Config.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecución en Navegador](#ejecución-en-navegador)
- [Compilación y Ejecución en Android](#compilación-y-ejecución-en-android)
- [Compilación y Ejecución en iOS](#compilación-y-ejecución-en-ios)
- [Configuración de Firebase](#configuración-de-firebase)
- [Testing](#testing)
- [Estructura del Proyecto](#estructura-del-proyecto)

## ✨ Características

- ✅ **Gestión de Tareas**: Crear, completar y eliminar tareas
- 🏷️ **Categorías**: Organizar tareas por categorías con colores personalizados
- 🔍 **Filtros**: Filtrar tareas por categoría
- 🎛️ **Feature Flags**: Control remoto de funcionalidades con Firebase Remote Config
- 💾 **Persistencia**: Almacenamiento local con localStorage
- 🎨 **Interfaz**: UI moderna con Ionic 8 y Material Design
- 📱 **Multiplataforma**: Web, Android e iOS

## 🛠️ Tecnologías

- **Framework**: Angular 20.0.0 (Standalone Components)
- **UI**: Ionic 8.0.0
- **Backend**: Firebase (Remote Config)
- **Mobile**: Cordova
- **Testing**: Jasmine + Karma
- **Lenguaje**: TypeScript 5.6

## 📦 Requisitos Previos

### Para Desarrollo Web

- **Node.js**: 18.x o superior
- **npm**: 9.x o superior
- **Ionic CLI**: 7.x o superior

```bash
npm install -g @ionic/cli
```

### Para Android

- **Java Development Kit (JDK)**: 17
- **Android Studio**: Última versión
- **Android SDK**: API Level 33 o superior
- **Gradle**: 8.x (incluido en Android Studio)

**Variables de entorno requeridas:**
```bash
# Windows (PowerShell)
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\TU_USUARIO\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"

# macOS/Linux (bash/zsh)
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
```

### Para iOS (solo macOS)

- **macOS**: Monterey o superior
- **Xcode**: 14.x o superior
- **CocoaPods**: 1.11 o superior
- **iOS SDK**: 16.0 o superior

```bash
# Instalar CocoaPods
sudo gem install cocoapods
```

## 🚀 Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/Juliantrv/To-Do-List.git
cd To-Do-List
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar Firebase** (ver sección [Configuración de Firebase](#configuración-de-firebase))

## 🌐 Ejecución en Navegador

### Modo Desarrollo

```bash
npm start
# o
ionic serve
```

La aplicación estará disponible en `http://localhost:8100`

### Modo Producción

```bash
npm run build -- --configuration production
```

## 📱 Compilación y Ejecución en Android

### 1. Preparar el Proyecto Cordova

```bash
# Agregar plataforma Android (solo la primera vez)
ionic cordova platform add android

# Instalar plugins de Cordova necesarios
ionic cordova plugin add cordova-plugin-device
ionic cordova plugin add cordova-plugin-statusbar
ionic cordova plugin add cordova-plugin-splashscreen
```

### 2. Compilar la Aplicación

**Opción A: Compilación de Desarrollo (Debug)**

```bash
# Compilar y ejecutar en emulador
ionic cordova run android

# Compilar y ejecutar en dispositivo físico conectado
ionic cordova run android --device

# Solo compilar (genera APK en platforms/android/app/build/outputs/apk/debug/)
ionic cordova build android
```

**Opción B: Compilación de Producción (Release)**

```bash
# Generar APK firmado
ionic cordova build android --release --prod

# Firmar el APK manualmente (después del build)
# 1. Generar keystore (solo la primera vez)
keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000

# 2. Firmar el APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk alias_name

# 3. Optimizar con zipalign
zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk To-Do-List.apk
```

### 3. Ejecutar en Emulador Android

**Desde Android Studio:**

1. Abrir Android Studio
2. Tools → AVD Manager
3. Crear/Iniciar un dispositivo virtual
4. Ejecutar: `ionic cordova run android --emulator`

**Desde línea de comandos:**

```bash
# Listar emuladores disponibles
emulator -list-avds

# Iniciar emulador específico
emulator -avd Pixel_5_API_33

# En otra terminal, ejecutar la app
ionic cordova run android --emulator
```

### 4. Ejecutar en Dispositivo Android Físico

1. **Habilitar opciones de desarrollador** en el dispositivo:
   - Ir a Configuración → Acerca del teléfono
   - Tocar "Número de compilación" 7 veces

2. **Habilitar depuración USB**:
   - Configuración → Opciones de desarrollador
   - Activar "Depuración USB"

3. **Conectar dispositivo** vía USB

4. **Verificar conexión**:
```bash
adb devices
# Debería mostrar tu dispositivo
```

5. **Ejecutar aplicación**:
```bash
ionic cordova run android --device
```

### Solución de Problemas Android

**Error: "SDK location not found"**
```bash
# Crear archivo local.properties en platforms/android/
echo "sdk.dir=C:\\Users\\TU_USUARIO\\AppData\\Local\\Android\\Sdk" > platforms/android/local.properties
```

**Error: "JAVA_HOME not set"**
```bash
# Verificar instalación de Java
java -version
javac -version

# Configurar JAVA_HOME
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
```

**Error: Gradle build failed**
```bash
# Limpiar y reconstruir
cd platforms/android
./gradlew clean
cd ../..
ionic cordova build android
```

## 🍎 Compilación y Ejecución en iOS

### 1. Preparar el Proyecto Cordova

```bash
# Agregar plataforma iOS (solo la primera vez)
ionic cordova platform add ios

# Instalar pods
cd platforms/ios
pod install
cd ../..
```

### 2. Compilar la Aplicación

**Opción A: Compilación de Desarrollo**

```bash
# Compilar y abrir en Xcode
ionic cordova build ios

# Abrir proyecto en Xcode
open platforms/ios/To-Do-List.xcworkspace
```

**Opción B: Compilación directa**

```bash
# Compilar y ejecutar en simulador
ionic cordova run ios

# Compilar y ejecutar en dispositivo
ionic cordova run ios --device
```

### 3. Ejecutar en Simulador iOS

**Desde Xcode:**

1. Abrir `platforms/ios/To-Do-List.xcworkspace` en Xcode
2. Seleccionar simulador en la barra superior (ej: iPhone 15)
3. Presionar ▶️ (Run) o `Cmd + R`

**Desde línea de comandos:**

```bash
# Listar simuladores disponibles
xcrun simctl list devices

# Ejecutar en simulador específico
ionic cordova run ios --emulator --target="iPhone-15"
```

### 4. Ejecutar en Dispositivo iOS Físico

**Requisitos:**
- Cuenta de Apple Developer (gratuita o de pago)
- Dispositivo registrado en tu cuenta
- Certificados de firma configurados

**Pasos:**

1. **Abrir proyecto en Xcode**:
```bash
open platforms/ios/To-Do-List.xcworkspace
```

2. **Configurar firma**:
   - Seleccionar el proyecto en el navegador
   - Ir a "Signing & Capabilities"
   - Seleccionar tu equipo (Team)
   - Xcode generará perfiles automáticamente

3. **Conectar dispositivo** vía USB

4. **Seleccionar dispositivo** en la barra superior de Xcode

5. **Ejecutar** (▶️ o `Cmd + R`)

6. **Confiar en la app** (primera vez):
   - En el dispositivo: Configuración → General → VPN y gestión de dispositivos
   - Tocar tu cuenta de desarrollador
   - Tocar "Confiar"

**Desde línea de comandos:**

```bash
ionic cordova run ios --device
```

### 5. Generar IPA para Distribución

```bash
# 1. Compilar para producción
ionic cordova build ios --release --prod

# 2. Abrir en Xcode
open platforms/ios/To-Do-List.xcworkspace

# 3. En Xcode:
#    - Product → Archive
#    - Window → Organizer
#    - Seleccionar el archive → Distribute App
```

### Solución de Problemas iOS

**Error: "CocoaPods not installed"**
```bash
sudo gem install cocoapods
pod setup
```

**Error: "Code signing failed"**
- Verificar que tienes una cuenta de Apple Developer activa
- En Xcode: Preferences → Accounts → Agregar tu Apple ID
- Seleccionar el proyecto → Signing & Capabilities → Elegir tu Team

**Error: "No provisioning profile found"**
```bash
# En Xcode, habilitar "Automatically manage signing"
# O crear perfil manualmente en developer.apple.com
```

**Error: Módulos no encontrados después de pod install**
```bash
cd platforms/ios
pod repo update
pod install --repo-update
cd ../..
```

## 🔥 Configuración de Firebase

### 1. Crear Proyecto Firebase

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Crear nuevo proyecto: "to-do-list-cfffa" (o el nombre que prefieras)
3. Agregar aplicación Web

### 2. Obtener Configuración

En Firebase Console → Configuración del proyecto → Tus aplicaciones → Configuración

### 3. Actualizar Archivos de Entorno

Los archivos ya están configurados, pero puedes usar tu propia configuración:

**`src/environments/environment.ts`** (Desarrollo)

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROJECT_ID.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID",
    measurementId: "TU_MEASUREMENT_ID"
  }
};
```

**`src/environments/environment.prod.ts`** (Producción)

Misma configuración con `production: true`

### 4. Configurar Remote Config

1. En Firebase Console → Remote Config
2. Agregar los siguientes parámetros:

| Parámetro | Tipo | Valor por defecto |
|-----------|------|-------------------|
| `enableCategories` | Boolean | `true` |
| `enableFilters` | Boolean | `true` |

3. Publicar cambios

### 5. Reglas de Seguridad (Opcional)

Si usas Firestore o Storage, configura las reglas en Firebase Console.

## 🧪 Testing

### Ejecutar Tests Unitarios

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar tests de un archivo específico
npm test -- --include='**/task.service.spec.ts'
```

### Cobertura de Tests

```bash
npm test -- --code-coverage
```

Los reportes se generan en `coverage/`

## 📁 Estructura del Proyecto

```
To-Do-List/
├── src/
│   ├── app/
│   │   ├── models/              # Modelos de datos
│   │   │   ├── task.model.ts
│   │   │   └── category.model.ts
│   │   ├── services/            # Servicios
│   │   │   ├── task.service.ts
│   │   │   ├── category.service.ts
│   │   │   └── remote-config.service.ts
│   │   ├── pages/              # Páginas
│   │   │   ├── home/
│   │   │   │   ├── components/  # Componentes de home
│   │   │   │   ├── home.page.ts
│   │   │   │   ├── home.page.html
│   │   │   │   └── home.page.scss
│   │   │   ├── categories/
│   │   │   └── settings/
│   │   ├── app.component.ts    # Componente raíz
│   │   └── app.routes.ts       # Configuración de rutas
│   ├── environments/           # Configuraciones de entorno
│   │   ├── environment.ts      # Desarrollo
│   │   └── environment.prod.ts # Producción
│   ├── theme/                  # Estilos globales
│   ├── assets/                 # Recursos estáticos
│   └── main.ts                 # Bootstrap de la aplicación
├── resources/                  # Recursos para Cordova
│   ├── android/
│   └── ios/
├── platforms/                  # Código nativo (generado)
│   ├── android/
│   └── ios/
├── config.xml                  # Configuración de Cordova
├── package.json
├── angular.json
├── tsconfig.json
└── README.md
```

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm start                    # Servidor de desarrollo
npm run build               # Compilar para producción
npm test                    # Ejecutar tests
npm run lint                # Verificar código

# Cordova
ionic cordova platform add android    # Agregar Android
ionic cordova platform add ios        # Agregar iOS
ionic cordova build android           # Compilar Android
ionic cordova build ios               # Compilar iOS
ionic cordova run android             # Ejecutar en Android
ionic cordova run ios                 # Ejecutar en iOS
```

## 🐛 Solución de Problemas Comunes

### Error: "Command not found: ionic"

```bash
npm install -g @ionic/cli
```

### Error: Node Sass no compatible

```bash
npm rebuild node-sass
```

### Error: Ports already in use

```bash
# Cambiar puerto
ionic serve --port=8200
```

### Limpiar caché de Ionic

```bash
ionic repair
```

### Reinstalar dependencias

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📄 Licencia

Este proyecto fue creado con fines educativos.

## 👨‍💻 Autor

**Julian Trujillo**
- GitHub: [@Juliantrv](https://github.com/Juliantrv)
- Proyecto: [To-Do-List](https://github.com/Juliantrv/To-Do-List)
