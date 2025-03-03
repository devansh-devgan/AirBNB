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