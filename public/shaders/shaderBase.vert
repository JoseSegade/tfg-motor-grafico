attribute vec3 position;
attribute vec2 texCoord;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform mat4 modelview;
uniform mat4 modelviewproj;

varying vec2 vTexCoord;

void main(){
    vTexCoord = texCoord;
    gl_Position = modelviewproj * vec4(position, 1.0);
}
