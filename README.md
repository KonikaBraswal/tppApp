To switch to stable branch and install dependencies, follow these steps:

## Switch to stable branch and install dependencies

1. `git checkout yourStableBranch`
2. `cd frontend`
3. `npm install`

To generate a private signing key for your Android app on Windows, follow these steps:

## Generating the Upload Key

1. Open Command Prompt as administrator.
2. Navigate to `C:\Program Files\Java\jdkx.x.x_x\bin`.
3. Run the following command:
   `keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000`
4. Follow the prompts to set passwords and Distinguished Name fields.

## Setting up Gradle Variables

1. Place `my-upload-key.keystore` under the `android/app` directory in your project folder.
2. Edit `android/gradle.properties` and add the following (replace **\*** with correct passwords):

   MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore

   MYAPP_UPLOAD_KEY_ALIAS=my-key-alias

   MYAPP_UPLOAD_STORE_PASSWORD=**\***

   MYAPP_UPLOAD_KEY_PASSWORD=**\***

## Adding Signing Config to Gradle

1. Edit `android/app/build.gradle` in your project folder.
2. Add the following signing config:

```groovy
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
```

## Building Release

1. Run `./gradlew clean` and then `./gradlew assembleRelease` to build your app.
