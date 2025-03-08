(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  
  const togglePassword = document.getElementById("togglePassword");
  const password = document.getElementById("password");

  togglePassword.addEventListener("click", function() {
    const type = password.type === "password" ? "text" : "password";
    password.type = type;
  });

  document.getElementById("newForm").addEventListener("submit", function(event) {
    const select = document.getElementById("category");

    if (select.value === "") {
      select.classList.add("is-invalid");
      event.preventDefault();
      event.stopPropagation();
    } else {
      select.classList.remove("is-invalid");
    }

    this.classList.add("was-validated");
  });

  function filterListings(category) {
    const urlParams = new URLSearchParams(window.location.search);
    const currentCategory = urlParams.get('category');
    if (currentCategory === category) {
        urlParams.delete('category'); // Remove category if already selected (reset filter)
    } else {
        urlParams.set('category', category); // Set new category
    }
    if (!urlParams.has('search')) {
        urlParams.set('search', ''); // Ensure search query exists in URL
    }
    window.location.href = `/listings?${urlParams.toString()}`;
  }

  function resetFilters() {
    window.location.href = "/listings"; // Redirects to clear filters
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".show-img").forEach(img => {
      img.addEventListener("click", function () {
        const fullscreenImg = document.createElement("div");
        fullscreenImg.innerHTML = `<div class="fullscreen-overlay" onclick="this.classList.add('fade-out'); setTimeout(() => this.remove(), 300)">
                                      <img src="${this.src}" class="fullscreen-img fade-in">
                                   </div>`;
        document.body.appendChild(fullscreenImg);
      });
    });
  });