#ifdef GL_ES
precision mediump float;
#endif

uniform vec4 tint;
uniform sampler2D diffuse;

uniform vec3 iResolution;
uniform float iTime;

varying vec2 vTexCoord;

vec3 nSphere(in vec3 pos, in vec4 sph) {
	return (pos-sph.xyz)/sph.w; 
}

float iSphere(in vec3 ro, in vec3 rd, in vec4 sph) {
 	// a sphere centered at the origin has equation module of xyz = radius
    
    // radius
    vec3 oc = ro - sph.xyz;
        
    float b = 2.0 * dot(oc, rd);
    float c = dot(oc, oc) - sph.w * sph.w;
    float h = b*b - 4.0 * c;
    
    if(h < 0.0) return -1.0;
    float t = (-b - sqrt(h)) / 2.0;
    return t;
}

vec3 nPlane(in vec3 pos) {
    return vec3(0.0, 1.0, 0.0);
}

float iPlane(in vec3 ro, in vec3 rd) {
    return -ro.y / rd.y;
}

vec4 sph1 = vec4(0.0, 1.0, 0.0, 1.0);
float intersect(in vec3 ro, in vec3 rd, out float resT) {
    resT = 1000.0;
    float id = -1.0;
    float tsp = iSphere(ro, rd, sph1);
    float tpla = iPlane(ro, rd);
    if(tsp > 0.0)
    {
        id = 1.0;
     	resT = tsp;   
    }
    
    if(tpla > 0.0 && tpla < resT) 
    {
        id = 2.0;
     	resT = tpla;
    }
    return id;
}

void main()
{
    vec3 light = normalize(vec3(1));
    
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    uv.x *= iResolution.x / iResolution.y;
    
    sph1.x = 0.5 * cos(iTime);
    sph1.z = 0.5 * sin(iTime);

    //Ray with origin ro and direction rd
    vec3 ro = vec3(0.0, 0.5, 3.0);
    vec3 rd = normalize(vec3(-1.0 + 2.0 * uv, -1.0));
    
    float t;
    float id = intersect(ro, rd, t);
    
    //	we draw black by default
    vec3 col = vec3(0.7);
    
    if(id > 0.0 && id < 1.5)
    {
    	//if we hit  the sphere
        vec3 pos = ro + t*rd;       
        vec3 nor = nSphere(pos, sph1);
        float dif = clamp(dot(nor, light), 0.0, 1.0);
        float amb = 0.5 + 0.5 * nor.y;
        col = vec3(0.9, 0.8, 0.6) * dif * amb + vec3(0.1, 0.2, 0.4) * amb;
    }
    else if(id > 1.5) {
    	// if we hit the plane
        vec3 pos = ro + t*rd;
        vec3 nor = nPlane(pos);
        float dif = clamp(dot(nor, light), 0.0, 1.0);
        float amb = smoothstep(0.0, 2.0 * sph1.w, length(pos.xz-sph1.xz));
        col = vec3(amb * 0.7);
    }
	col = sqrt(col);
    // Output to screen
    gl_FragColor = vec4(col, 1.0);
}