uniform vec2 windowSize;
uniform vec3 mainHueColor;
uniform int isHueComponent;
uniform float finalColor;

uniform float hueValue;
uniform float hueSplit;
uniform float totalZoom;

uniform float saturation;
uniform float lightness;

#define M_PI 3.1415926535897932384626433832795

void gammaCorrect(inout vec3 value) {
  float gamma = 1.2;
  value.x = pow(value.x, gamma);
  value.y = pow(value.y, gamma);
  value.z = pow(value.z, gamma);
}
float mapValue (float v, float a, float b, float c, float d) {
  return c + (d - c) * ((v - a) / (b - a));
}

// linear ramp up / down based on a given offset and total %
float rgbStepper(float offset, float t) {
  t = mod(t + offset, 1.0); 
  float _1o6 = 1.0 / 6.0;
  float _1o2 = 1.0 / 2.0;

  if (t < _1o6) {
    return mix(0.0, 1.0, t / _1o6);
    
  } else if ( t < _1o2 ) { 
    return 1.0;

  } else if (t < (2.0 / 3.0)) { 
    return mix(1.0, 0.0, ((t - _1o2) / _1o6));

  } else {
    return 0.0;
  }
}

vec3 HUEtoRGB(float H) {
  float R = abs(H * 6.0 - 3.0) - 1.0;
  float G = 2.0 - abs(H * 6.0 - 2.0);
  float B = 2.0 - abs(H * 6.0 - 4.0);
  return clamp(vec3(R,G,B), 0.0, 1.0);
}

vec3 HSLtoRGB(in vec3 HSL) {
  vec3 RGB = HUEtoRGB(HSL.x);
  float C = (1.0 - abs(2.0 * HSL.z - 1.0)) * HSL.y;
  return (RGB - 0.5) * C + HSL.z;
}

vec3 getSpectrumFromPercent( float t ) {
  return vec3(HUEtoRGB(t));
  //return vec3(
  //  rgbStepper( 1.0 / 3.0, t ), 
  //  rgbStepper( 2.0 / 3.0, t ), 
  //  rgbStepper( 0.0, t ) 
  //);
}

float getScaledT ( float x ) {
  float totalZoom = 0.1;
  float lowValue = hueValue - (totalZoom * hueValue);
  return mapValue(x, 0.0, 1.0, lowValue, lowValue + totalZoom);
}

vec3 saturateByPercentage( vec3 mainColor, float t ) {
  float minGrey = 0.3 * mainColor.x + 0.59 * mainColor.y + 0.11 * mainColor.z;
  vec3 alpha = vec3(minGrey, minGrey, minGrey);
  return mix(alpha, mainColor, t);
}

float Epsilon = 1e-10;

vec3 RGBtoHCV(in vec3 RGB) {
  // Based on work by Sam Hocevar and Emil Persson
  vec4 P = (RGB.g < RGB.b) ? vec4(RGB.bg, -1.0, 2.0/3.0) : vec4(RGB.gb, 0.0, -1.0/3.0);
  vec4 Q = (RGB.r < P.x) ? vec4(P.xyw, RGB.r) : vec4(RGB.r, P.yzx);
  float C = Q.x - min(Q.w, Q.y);
  float H = abs((Q.w - Q.y) / (6.0 * C + Epsilon) + Q.z);
  return vec3(H, C, Q.x);
}

vec3 RGBtoHSL(in vec3 RGB) {
  vec3 HCV = RGBtoHCV(RGB);
  float L = HCV.z - HCV.y * 0.5;
  float S = HCV.y / (1.0 - abs(L * 2.0 - 1.0) + Epsilon);
  return vec3(HCV.x, S, L);
}

vec3 lightnessByPercentage (vec3 mainColor, float t) {
  vec3 hslMainColor = RGBtoHSL(mainColor);
  hslMainColor.z = t;
  return HSLtoRGB(hslMainColor);
}

vec3 getSaturationFromPercent( float t ) {
  return saturateByPercentage( mainHueColor, t);
}
float getLightness (vec3 mainColor) {
  float minHue = min(min(mainColor.x, mainColor.y), mainColor.z);
  float maxHue = max(max(mainColor.x, mainColor.y), mainColor.z);
  return (minHue + maxHue) * 0.5;
}


vec3 getLightnessFromPercent( float t ) {
  float lightness = getLightness(mainHueColor);
  if (t < lightness) {
    return mix(vec3(0.0, 0.0, 0.0), mainHueColor, mapValue(t, 0.0, lightness, 0.0, 1.0)); 
  } else {
    return mix(mainHueColor, vec3(1.0, 1.0, 1.0), mapValue(t, lightness, 1.0, 0.0, 1.0)); 
  }
}

void main() {
  // percentage widths 0-1
  float x = gl_FragCoord.x / windowSize.x;
  float y = gl_FragCoord.y / windowSize.y;

  float r = 0.0;
  float g = 0.0;
  float b = 0.0;
  
  vec3 outputColor;

  // horizontal: saturation,
  // vertical: lightness
  if (isHueComponent == 1) {
    vec3 alpha = vec3(x,x,x);
    vec3 yColor = vec3(y,y,y);
    outputColor = mix(yColor, mainHueColor, alpha);
    outputColor = mix(outputColor, yColor, 1.0 - yColor);

  // radial hue
  } else if (isHueComponent == 2) {

    vec2 midPoint = vec2(windowSize * 0.5);
    float angle = atan(gl_FragCoord.y - midPoint.y, gl_FragCoord.x - midPoint.x) + M_PI;
    float normAngle = angle / (M_PI * 2.0);

    // horizontal
    r = rgbStepper( 1.0 / 3.0, normAngle ); 
    g = rgbStepper( 2.0 / 3.0, normAngle ); 
    b = rgbStepper( 0.0, normAngle ); 
    outputColor = vec3(r, g, b);

  // horizontal hue 
  } else if (isHueComponent == 3) {
    r = rgbStepper( 1.0 / 3.0, x ); 
    g = rgbStepper( 2.0 / 3.0, x ); 
    b = rgbStepper( 0.0, x ); 
    outputColor = vec3(r,g,b);

  // split horizontal hue 
  } else if (isHueComponent == 4) {

    if (y > hueSplit) {
      outputColor = getSpectrumFromPercent(x);
    } else {
      outputColor = getSpectrumFromPercent(getScaledT(x));
    }

    outputColor = saturateByPercentage(outputColor, saturation);
    outputColor = lightnessByPercentage(outputColor, lightness);

  // saturation component
  } else if (isHueComponent == 5) {
    if (y > hueSplit) { 
      outputColor = getSaturationFromPercent(x);
    } else {
      outputColor = getSaturationFromPercent(getScaledT(x));
    }
    outputColor = lightnessByPercentage(outputColor, lightness);
    

  // lightness component
  } else if (isHueComponent == 6) {
    if (y > hueSplit) { 
      outputColor = getLightnessFromPercent(x);
    } else {
      outputColor = getLightnessFromPercent(getScaledT(x));
    }
    outputColor = saturateByPercentage(outputColor, saturation);
    
  }

  gl_FragColor = vec4(outputColor, 1.0);
}
