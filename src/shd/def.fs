#version 300 es
precision highp float;

uniform float uTime;
uniform float transX;
uniform float transY;
uniform float transZ;
uniform float range;
uniform sampler2D Tex0;

out vec4 oColor;

vec2 vec2mulvec2(vec2 a, vec2 b)
{
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

float Arg(vec2 a)
{
    if (a.x > 0.0)
      return atan(a.y / a.x);
    if (a.x == 0.0)
      return asin(1.0) * sign(a.y);
    return atan(a.y / a.x) + acos(-1.0) * sign(a.y);
}

vec2 vec2pow(vec2 a, float b)
{
    float fi = Arg(a);

    return vec2(cos(fi * b), sin(fi * b)) * pow(length(a), b);
}

float vec2rec(vec2 xy)
{
    vec2 z = xy;
    float i;

    while (length(z) < 2.0 && i < 500.0)
    {
      i++;
      z = vec2pow(z, range) + xy;
    }

    return i;
}

void main(void)
{
    vec2 xy = vec2(gl_FragCoord);
    xy -= 500.0;
    xy *= pow(10.0, transZ);
    xy += 500.0;
    xy.x += transX;
    xy.y -= transY;
    xy = xy / 1000.0;
    xy.x -= 0.5;
    xy.y -= 0.5;
    float i = vec2rec(xy);

    oColor = vec4(texture(Tex0, xy).xyz, i / 500.0);
}
