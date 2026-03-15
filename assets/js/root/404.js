/* --- SMOOTH 3D TRACKING LOGIC --- */
const wrapper = document.getElementById('magnetic-area');
let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

// Smooth animation loop
function updateTransform() {
  currentX += (targetX - currentX) * 0.1; // Easing factor
  currentY += (targetY - currentY) * 0.1;

  wrapper.style.transform = `rotateY(${currentX}deg) rotateX(${currentY}deg)`;
  requestAnimationFrame(updateTransform);
}

updateTransform();

// Calculate the tilt based on mouse position
document.addEventListener('mousemove', (e) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const deltaX = e.pageX - centerX;
  const deltaY = e.pageY - centerY;

  if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
    targetX = -deltaY / 50;
    targetY = deltaX / 50;
  }
});

// Smooth reset when mouse leaves
document.addEventListener('mouseleave', () => {
  targetX = 0;
  targetY = 0;
});
