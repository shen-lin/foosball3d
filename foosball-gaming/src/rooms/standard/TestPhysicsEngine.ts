import { World, Vec3, Body, Plane, Sphere } from "cannon";

let world = new World();

world.gravity = new Vec3(0, -9.82, 0);

let ballShape = new Sphere(0.2);
let ballBody = new Body({
  shape: ballShape,
  mass: 5,
  position: new Vec3(0, 5, 0)
});

let groundShape = new Plane();
let groundBody = new Body({
  shape: groundShape,
  mass: 0
});
groundBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);

world.addBody(ballBody);
world.addBody(groundBody);

for (var i = 0; i < 60; ++i) {
    world.step(1/60);
    console.log(
      ballBody.position.x,
      ballBody.position.y,
      ballBody.position.z
    );
  }