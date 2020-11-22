#ifdef GL_ES
precision mediump float;
#endif

uniform vec4 tint;
uniform sampler2D diffuse;

varying vec2 vTexCoord;

void main() {
    gl_FragColor = tint * texture2D(diffuse, vTexCoord);
}
