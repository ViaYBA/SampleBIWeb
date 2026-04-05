//--PROFILE IMAGE CHANGE--
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const display = document.getElementById('profile-display');
            display.style.backgroundImage = `url(${e.target.result})`;
            display.querySelector('i').style.display = 'none';
        }
        reader.readAsDataURL(input.files[0]);
    }
}

//--TOGGLE EDIT FIELD--
function toggleEdit(field) {
    const display = document.getElementById(`${field}-display`);
    const input = document.getElementById(`${field}-input`);
    const icon = document.getElementById(`${field}-icon`);

    //Check if in View or Edit mode
    const isEditing = input.style.display !== 'none';

    if (isEditing) {
        // SAVE MODE - Update display with input after
        display.innerText = input.value;
        
        // Toggles back to View mode
        display.style.display = "inline";
        input.style.display = "none";
        
        //Change icon back to Edit
        icon.classList.replace('fa-check', 'fa-edit');
    } else {
        //EDIT MODE - Input field
        display.style.display = "none";
        input.style.display = "inline-block";
        
        //Set focus so user can type
        input.focus();
        
        //Change icon to Checkmark for Save
        icon.classList.replace('fa-edit', 'fa-check');
    }
}

//--CHANGE PASSWORD-- (Assuming its the same page as the forgot password? blank for now)
document.querySelector('.btn-primary').addEventListener('click', () => {
    alert("Change Password clicked");
});