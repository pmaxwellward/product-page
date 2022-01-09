window.addEventListener("load", (e) => {
    
    // Intersection observer options

    let options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.25
    };
    
    // Observer init with callback function

    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                
                // Apply animation based on class when intersection with viewport is observed 

                if (entry.target.classList.contains("specs-checklist")) {
                    entry.target.classList.add("is-visible-wipe");
                } 
                
                else if (entry.target.classList.contains("superscript")) {
                    titleAnimation(entry.target);
                } 
                
                else {
                    entry.target.classList.add("is-visible");
                }
                
                // Use delay if desktop client

                if (entry.target.classList.contains("l-info-img")) {
                    if (window.matchMedia('(max-width: 600px)')) {
                        entry.target.classList.add("is-visible-delay");
                    } else {
                        entry.target.classList.add("is-visible");
                    }
                }

                // Remove class that initially sets element opacity to 0

                entry.target.addEventListener("animationend", () => {
                    entry.target.classList.remove("is-not-visible");
                });

                observer.unobserve(entry.target);

                function titleAnimation(target) {

                    let mainTitle = document.querySelector(".main-title");
                    let subtitle = document.querySelector(".subtitle");
                    let btn = document.querySelector(".l-splash-btn");
                    
                    target.addEventListener("animationend", () => {
                        mainTitle.classList.add("is-visible-title");
                    })
                    mainTitle.addEventListener("animationend", () => {
                        subtitle.classList.add("is-visible-title");
                        mainTitle.classList.remove("is-not-visible");
                    });
                    subtitle.addEventListener("animationend", () => {
                        btn.classList.add("is-visible");
                        subtitle.classList.remove("is-not-visible");
                    });
                    btn.addEventListener("animationend", () => {
                        btn.classList.remove("is-not-visible");
                    })

                    target.classList.add("is-visible-title"); 
                }
            }
        })
    }, options);
    
    // Collect all intened observe targets

    let targets = [];

    targets.push(...document.querySelectorAll(".l-info-text"));
    targets.push(...document.querySelectorAll(".l-info-img"));
    targets.push(document.querySelector(".specs-checklist"));
    targets.push(document.querySelector(".specs-title"));
    targets.push(document.querySelector(".l-specs"));
    targets.push(document.querySelector(".superscript"));
    targets.push(document.querySelector(".l-product"));

    // Add class that initializes target's opactiy to 0

    targets.forEach(item => item.classList.add("is-not-visible"));

    // Assign targets to observer 
    
    targets.forEach(el => {
        observer.observe(el);
    });

        
    /* 3D product */
    
    const canvas = document.getElementById("renderCanvas");
    const engine = new BABYLON.Engine(canvas, true);

    canvas.addEventListener("webglcontextlost", function(event) {
        event.preventDefault();
        console.log("context lost. use a better computer");
    }, false);
    
    const createScene = () => {
    
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = BABYLON.Color3(0, 0, 0);
    
        const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI/2, Math.PI/2.5, 3, new BABYLON.Vector3(0, 0, 0), scene);
        camera.inputs.attached.mousewheel.wheelPrecision = 100;
        camera.activeCamera = true;
        camera.attachControl(canvas, true);
    
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(-1, 1, 0), scene);
    
        BABYLON.SceneLoader.ImportMesh(["Cylinder"], "./mesh/", "product.gltf", scene, function (meshes) {
            meshes[1].position.y = 0;
            camera.setTarget(new BABYLON.Vector3(0, .5, 0));
            camera.radius = 5.0;
            scene.registerBeforeRender(rotateMesh.bind(this, meshes[1]));
        });
        
        function rotateMesh(mesh) {
            mesh.rotate(BABYLON.Axis.Y, Math.PI/400, BABYLON.Space.WORLD);
        }
    
        return scene;
    }
    
    const scene = createScene();
    
    // Limit mouse scroll zoom out

    scene.registerBeforeRender(() => {
    
      if (scene.activeCamera.radius < 2.0) {
          scene.activeCamera.radius = 2.0;
      }
    })
    
    engine.runRenderLoop(function() {
        scene.render()
    });

});

