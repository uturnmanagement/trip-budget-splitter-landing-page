document.addEventListener('DOMContentLoaded', ()=>{
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('navLinks');
  toggle.addEventListener('click', ()=>{
    if(nav.style.display === 'flex'){
      nav.style.display = '';
    } else {
      nav.style.display = 'flex';
      nav.style.flexDirection = 'column';
    }
  });

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(href.length>1){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
        // close nav on mobile
        if(window.innerWidth < 600) nav.style.display = '';
      }
    })
  })

  // Configurable API base URL (change for production)
  const API_BASE = 'http://localhost:3000'; // Update to Railway URL after deployment

  // Waitlist form handling (now with backend)
  const form = document.getElementById('waitlistForm');
  if(form){
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const name = document.getElementById('firstName').value.trim();
      const email = document.getElementById('email').value.trim();
      const trustLine = form.querySelector('.trust-line');

      try {
        const response = await fetch(`${API_BASE}/api/waitlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName: name, email: email })
        });
        const data = await response.json();

        if (response.ok) {
          // Success
          form.innerHTML = '<div class="success-message">' + data.message + '</div>';
        } else {
          // Error
          trustLine.textContent = data.error;
          trustLine.style.color = '#ffb3a7';
        }
      } catch (error) {
        console.error('Submission error:', error);
        trustLine.textContent = 'Something went wrong. Please try again.';
        trustLine.style.color = '#ffb3a7';
      }
    });
  }
});
