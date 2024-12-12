export default class Onboarding {
    constructor() {
        this.userData = {
            name: '',
            avatar: ''
        };
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'overlay';
        
        modal.innerHTML = `
            <div class="onboarding-modal">
                <h2>Welcome to ToDoList!</h2>
                <div id="name-step">
                    <p>What's your name?</p>
                    <input type="text" id="username" placeholder="Enter your name" required>
                    <button class="btn btn-primary" id="next-btn">Next</button>
                </div>
                <div id="avatar-step" style="display: none;">
                    <p>Choose a profile picture</p>
                    <div class="avatar-upload">
                        <div class="avatar-preview">
                            <div id="avatar-preview-image"></div>
                        </div>
                        <div class="avatar-actions">
                            <input type="file" id="avatar-upload" accept="image/*" class="file-input">
                            <label for="avatar-upload" class="btn btn-secondary">Choose File</label>
                            <button class="btn btn-primary" id="complete-btn">Complete Setup</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    
        return modal;
    }
    
    createDefaultAvatar(name) {
        const initials = name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    
        return `
            <div class="default-avatar">
                <span>${initials}</span>
            </div>
        `;
    }

    getAvatarOptions() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
        return colors.map((color, index) => `
            <div class="avatar-option" data-avatar="avatar${index + 1}">
                <svg width="100%" height="100%" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="20" fill="${color}"/>
                </svg>
            </div>
        `).join('');
    }

    init() {
        return new Promise((resolve) => {
            const existingUser = localStorage.getItem('bootdoUser');
            if (existingUser) {
                resolve(JSON.parse(existingUser));
                return;
            }
    
            const modal = this.createModal();
            document.body.appendChild(modal);
    
            const nameStep = modal.querySelector('#name-step');
            const avatarStep = modal.querySelector('#avatar-step');
            const usernameInput = modal.querySelector('#username');
            const nextBtn = modal.querySelector('#next-btn');
            const completeBtn = modal.querySelector('#complete-btn');
            const fileInput = modal.querySelector('#avatar-upload');
            const previewImage = modal.querySelector('#avatar-preview-image');
    
            nextBtn.addEventListener('click', () => {
                if (usernameInput.value.trim()) {
                    this.userData.name = usernameInput.value.trim();
                    nameStep.style.display = 'none';
                    avatarStep.style.display = 'block';
                    
                    const defaultAvatarHTML = this.createDefaultAvatar(this.userData.name);
                    const previewContainer = modal.querySelector('#avatar-preview-image');
                    previewContainer.innerHTML = defaultAvatarHTML;
                    this.userData.avatar = 'default';
                }
            });
    
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const imageUrl = e.target.result;
                        const previewContainer = modal.querySelector('#avatar-preview-image');
                        previewContainer.innerHTML = '';
                        previewContainer.style.backgroundImage = `url(${imageUrl})`;
                        this.userData.avatar = imageUrl;
                    };
                    reader.readAsDataURL(file);
                }
            });
    
            completeBtn.addEventListener('click', () => {
                this.completeOnboarding(modal, resolve);
            });
        });
    }

    completeOnboarding(modal, resolve) {
        localStorage.setItem('ToDoListUser', JSON.stringify(this.userData));
        document.body.removeChild(modal);
        resolve(this.userData);
    }
}