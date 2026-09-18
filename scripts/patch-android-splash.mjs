import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const resDir = path.join(root, 'android', 'app', 'src', 'main', 'res');
const valuesDir = path.join(resDir, 'values');
const drawableDir = path.join(resDir, 'drawable');
const stylesPath = path.join(valuesDir, 'styles.xml');
const colorsPath = path.join(valuesDir, 'colors.xml');
const launchBackgroundPath = path.join(drawableDir, 'nihulon_launch_background.xml');
const manifestPath = path.join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');

if (!fs.existsSync(path.join(root, 'android'))) {
  console.error('Android platform not found. Run: npm run android:add');
  process.exit(1);
}

fs.mkdirSync(valuesDir, { recursive: true });
fs.mkdirSync(drawableDir, { recursive: true });

const upsertResource = (filePath, name, xmlLine) => {
  let xml = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, 'utf8')
    : '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n</resources>\n';

  const matcher = new RegExp(`\\s*<color\\s+name=["']${name}["'][^>]*>[^<]*<\\/color>`, 'i');
  if (matcher.test(xml)) {
    xml = xml.replace(matcher, `\n    ${xmlLine}`);
  } else {
    xml = xml.replace(/<\/resources>/, `    ${xmlLine}\n</resources>`);
  }
  fs.writeFileSync(filePath, xml);
};

upsertResource(colorsPath, 'nihulon_splash_background', '<color name="nihulon_splash_background">#FFFFFF</color>');

fs.writeFileSync(
  launchBackgroundPath,
  `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/nihulon_splash_background" />
    <item
        android:width="112dp"
        android:height="112dp"
        android:gravity="center"
        android:drawable="@mipmap/ic_launcher" />
</layer-list>
`
);

if (!fs.existsSync(stylesPath)) {
  console.error(`Missing ${stylesPath}`);
  process.exit(1);
}

let styles = fs.readFileSync(stylesPath, 'utf8');
const splashStyle = `    <style name="AppTheme.NoActionBarLaunch" parent="Theme.SplashScreen">
        <!-- API 21-30: immediate white launch window with the app icon. -->
        <item name="android:windowBackground">@drawable/nihulon_launch_background</item>
        <!-- Android 12+: native system splash. -->
        <item name="windowSplashScreenBackground">@color/nihulon_splash_background</item>
        <item name="windowSplashScreenAnimatedIcon">@mipmap/ic_launcher</item>
        <item name="postSplashScreenTheme">@style/AppTheme.NoActionBar</item>
    </style>`;

const launchThemePattern = /\s*<style\s+name=["']AppTheme\.NoActionBarLaunch["'][\s\S]*?<\/style>/m;
if (launchThemePattern.test(styles)) {
  styles = styles.replace(launchThemePattern, `\n${splashStyle}`);
} else {
  styles = styles.replace(/<\/resources>/, `\n${splashStyle}\n</resources>`);
}
fs.writeFileSync(stylesPath, styles);

if (fs.existsSync(manifestPath)) {
  let manifest = fs.readFileSync(manifestPath, 'utf8');
  const activityPattern = /<activity([\s\S]*?android:name=["']\.MainActivity["'][\s\S]*?)>/m;
  const match = manifest.match(activityPattern);
  if (match && !/android:theme=["']@style\/AppTheme\.NoActionBarLaunch["']/.test(match[0])) {
    const updated = match[0].replace(
      /android:theme=["'][^"']+["']/,
      'android:theme="@style/AppTheme.NoActionBarLaunch"'
    );
    manifest = manifest.replace(match[0], updated);
    fs.writeFileSync(manifestPath, manifest);
  }
}

console.log('✓ Android splash patched: white background + launcher logo');
