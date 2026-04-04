// Plant Disease Database (Mock)
const diseaseDatabase = [
    {
        name: "Mildiou de la tomate",
        scientificName: "Phytophthora infestans",
        severity: "Sévère",
        confidence: 98.5,
        description: "Maladie fongique dévastatrice causée par l'oomycète Phytophthora infestans. Se manifeste par des taches sombres irrégulières sur les feuilles et les fruits.",
        treatment: "Application de fongicide à base de cuivre (Bordeaux). Retirer immédiatement les feuilles infectées. Assurer une circulation d'air optimale.",
        prevention: "Espacer les plants (60-80cm). Arroser au pied uniquement. Utiliser des paillis pour éviter les éclaboussures de sol.",
        image: "http://static.photos/nature/640x360/1"
    },
    {
        name: "Rouille du blé",
        scientificName: "Puccinia triticina",
        severity: "Modérée",
        confidence: 94.2,
        description: "Maladie fongique se présentant sous forme de pustules orangées sur les feuilles, réduisant la photosynthèse.",
        treatment: "Fongicides azolés. Retirer les plantes fortement infectées.",
        prevention: "Varietés résistantes. Rotation des cultures. Éviter l'excès d'azote.",
        image: "http://static.photos/nature/640x360/2"
    },
    {
        name: "Cercosporiose",
        scientificName: "Cercospora spp",
        severity: "Légère",
        confidence: 89.7,
        description: "Taches circulaires grises entourées d'un halo brun sur les feuilles. Progression rapide par temps humide.",
        treatment: "Fongicides systémiques. Éliminer les débris végétaux.",
        prevention: "Paillage. Irrigation goutte-à-goutte. Bonne aération.",
        image: "http://static.photos/nature/640x360/3"
    },
    {
        name: "Mosaïque du tabac",
        scientificName: "Tobamovirus",
        severity: "Sévère",
        confidence: 96.3,
        description: "Virus provoquant une mosaïque jaune-verte sur les feuilles, déformation et rabougrissement.",
        treatment: "Aucun traitement curatif. Arracher et détruire les plants infectés.",
        prevention: "Lavage des mains et outils. Résistance variétale. Lutte anti-pucerons.",
        image: "http://static.photos/nature/640x360/4"
    },
    {
        name: "Oïdium",
        scientificName: "Erysiphales",
        severity: "Modérée",
        confidence: 92.1,
        description: "Poudre blanche caractéristique sur les feuilles, tiges et fruits. Réduit la croissance.",
        treatment: "Soufre ou bicarbonate de potassium. Lait dilué (1:10) comme alternative bio.",
        prevention: "Ensoleillement maximal. Éviter l'humidité excessive. Variétés résistantes.",
        image: "http://static.photos/nature/640x360/5"
    },
    {
        name: "Brûlure bactérienne",
        scientificName: "Xanthomonas spp",
        severity: "Sévère",
        confidence: 97.8,
        description: "Taches nécrotiques entourées de halos jaunes. Contamination par les outils et éclaboussures.",
        treatment: "Cuivre organique. Streptomycine (si autorisé). Destruction des plants.",
        prevention: "Semences certifiées. Désinfection outils. Rotation 3 ans.",
        image: "http://static.photos/nature/640x360/6"
    }
];

// Global state
let currentStream = null;
let history = JSON.parse(localStorage.getItem('plantHistory')) || [];
let currentUser = JSON.parse(localStorage.getItem('plantUser')) || null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    updateHistoryCount();
    checkAuthState();
});

// Update navigation based on auth state
function updateNavigation() {
    const isLoggedIn = !!currentUser;
    const navIds = ['nav-diagnostic', 'nav-history', 'nav-diagnostic-mobile', 'nav-history-mobile'];
    
    navIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (isLoggedIn) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }
    });
}

// Navigation
function showSection(sectionId) {
    // Hide all sections
    ['home', 'diagnostic', 'auth', 'history'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    
    // Show target
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('hidden');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Close mobile menu if open
    document.getElementById('mobile-menu')?.classList.add('hidden');
    
    lucide.createIcons();
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// File Upload Handling
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) processImage(file);
}

// Drag and drop
document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.querySelector('#upload-area > div');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('border-emerald-500', 'bg-emerald-50');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('border-emerald-500', 'bg-emerald-50');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-emerald-500', 'bg-emerald-50');
            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) processImage(files[0]);
        });
    }
});

// Camera Functions
async function openCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        currentStream = stream;
        const video = document.getElementById('camera-video');
        video.srcObject = stream;
        document.getElementById('camera-modal').classList.remove('hidden');
    } catch (err) {
        alert('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
    }
}

function closeCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
    document.getElementById('camera-modal').classList.add('hidden');
}

function capturePhoto() {
    const video = document.getElementById('camera-video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        processImage(file);
        closeCamera();
    }, 'image/jpeg');
}

// Main Processing Function
function processImage(file) {
    if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide');
        return;
    }
    
    // Hide upload, show progress
    document.getElementById('upload-area').classList.add('hidden');
    document.getElementById('analysis-progress').classList.remove('hidden');
    
    // Simulate microservice workflow
    simulateAnalysisSteps();
    
    // Simulate API call to ML microservice
    setTimeout(() => {
        const result = analyzeWithML();
        displayResults(result, file);
    }, 4000);
}

function simulateAnalysisSteps() {
    const steps = [
        { id: 'step-1', status: 'Prétraitement de l\'image...', delay: 0 },
        { id: 'step-2', status: 'Extraction des caractéristiques (CNN)...', delay: 1000 },
        { id: 'step-3', status: 'Classification avec ResNet50...', delay: 2000 },
        { id: 'step-4', status: 'Génération des recommandations...', delay: 3000 }
    ];
    
    steps.forEach(step => {
        setTimeout(() => {
            const el = document.getElementById(step.id);
            if (el) {
                el.classList.remove('bg-gray-50');
                el.classList.add('bg-emerald-50', 'border-l-4', 'border-emerald-500');
                el.querySelector('div').classList.remove('bg-gray-300');
                el.querySelector('div').classList.add('bg-emerald-500');
                
                const statusEl = document.getElementById('analysis-status');
                if (statusEl) statusEl.textContent = step.status;
                
                // Add checkmark when done
                setTimeout(() => {
                    el.querySelector('div').innerHTML = '✓';
                }, 800);
            }
        }, step.delay);
    });
}

function analyzeWithML() {
    // Simulate ML prediction with random selection weighted by confidence
    const random = Math.random() * 100;
    let selectedDisease;
    
    if (random > 80) selectedDisease = diseaseDatabase[0];
    else if (random > 60) selectedDisease = diseaseDatabase[3];
    else if (random > 40) selectedDisease = diseaseDatabase[5];
    else if (random > 20) selectedDisease = diseaseDatabase[1];
    else selectedDisease = diseaseDatabase[4];
    
    // Add some randomness to confidence
    const confidence = Math.min(99, selectedDisease.confidence + (Math.random() * 4 - 2));
    
    return {
        ...selectedDisease,
        confidence: confidence.toFixed(1),
        timestamp: new Date().toISOString(),
        id: Date.now()
    };
}

function displayResults(result, file) {
    document.getElementById('analysis-progress').classList.add('hidden');
    const resultsDiv = document.getElementById('results');
    resultsDiv.classList.remove('hidden');
    
    // Update UI with results
    document.getElementById('disease-name').textContent = result.name;
    document.getElementById('disease-description').textContent = result.description;
    document.getElementById('confidence-score').textContent = result.confidence + '%';
    document.getElementById('treatment-text').textContent = result.treatment;
    document.getElementById('prevention-text').textContent = result.prevention;
    document.getElementById('processing-time').textContent = 'Traité en ' + (1.2 + Math.random()).toFixed(1) + 's';
    
    // Severity badge color
    const severityEl = document.getElementById('disease-severity');
    severityEl.textContent = result.severity;
    severityEl.className = 'px-2 py-1 rounded text-xs font-medium ' + 
        (result.severity === 'Sévère' ? 'bg-red-100 text-red-700' : 
         result.severity === 'Modérée' ? 'bg-yellow-100 text-yellow-700' : 
         'bg-green-100 text-green-700');
    
    // Display image
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('result-image').src = e.target.result;
    };
    reader.readAsDataURL(file);
    
    // Save to history
    saveToHistory(result, file);
    
    // Generate similar diseases
    generateSimilarDiseases(result);
    
    lucide.createIcons();
}

function generateSimilarDiseases(currentResult) {
    const container = document.getElementById('similar-diseases');
    container.innerHTML = '';
    
    const others = diseaseDatabase.filter(d => d.name !== currentResult.name).slice(0, 3);
    others.forEach(disease => {
        const div = document.createElement('div');
        div.className = 'border rounded-xl p-4 hover:shadow-md transition cursor-pointer';
        div.innerHTML = `
            <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <i data-lucide="leaf" class="w-5 h-5 text-gray-600"></i>
                </div>
                <div>
                    <div class="font-medium text-sm">${disease.name}</div>
                    <div class="text-xs text-gray-500">${disease.scientificName}</div>
                </div>
            </div>
            <div class="text-xs text-gray-600 line-clamp-2">${disease.description}</div>
            <div class="mt-2 text-xs font-medium text-emerald-600">${disease.confidence}% de probabilité</div>
        `;
        container.appendChild(div);
    });
}

function resetAnalysis() {
    document.getElementById('results').classList.add('hidden');
    document.getElementById('upload-area').classList.remove('hidden');
    document.getElementById('file-input').value = '';
    
    // Reset steps
    ['step-1', 'step-2', 'step-3', 'step-4'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('bg-emerald-50', 'border-l-4', 'border-emerald-500');
            el.classList.add('bg-gray-50');
            el.querySelector('div').classList.remove('bg-emerald-500');
            el.querySelector('div').classList.add('bg-gray-300');
            el.querySelector('div').textContent = id.split('-')[1];
        }
    });
}

// History Management
function saveToHistory(result, file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const historyItem = {
            ...result,
            imageData: e.target.result
        };
        history.unshift(historyItem);
        if (history.length > 50) history.pop();
        localStorage.setItem('plantHistory', JSON.stringify(history));
        updateHistoryCount();
    };
    reader.readAsDataURL(file);
}

function updateHistoryCount() {
    const count = history.length;
    const el = document.getElementById('history-count');
    if (el) el.textContent = count + ' analyse' + (count > 1 ? 's' : '') + ' effectuée' + (count > 1 ? 's' : '');
    
    // Update history list if on history page
    renderHistory();
}

function renderHistory() {
    const container = document.getElementById('history-list');
    const emptyState = document.getElementById('empty-history');
    
    if (!container) return;
    
    if (history.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }
    
    if (emptyState) emptyState.classList.add('hidden');
    
    container.innerHTML = history.map(item => `
        <div class="disease-card bg-white rounded-2xl shadow-lg overflow-hidden">
            <div class="h-48 overflow-hidden relative">
                <img src="${item.imageData}" alt="${item.name}" class="w-full h-full object-cover">
                <div class="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg text-xs font-bold text-emerald-700">
                    ${item.confidence}%
                </div>
            </div>
            <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs text-gray-500">${new Date(item.timestamp).toLocaleDateString('fr-FR')}</span>
                    <span class="px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(item.severity)}">
                        ${item.severity}
                    </span>
                </div>
                <h3 class="font-bold text-lg mb-1">${item.name}</h3>
                <p class="text-sm text-gray-600 line-clamp-2 mb-3">${item.description}</p>
                <button onclick="viewHistoryDetail(${item.id})" class="w-full py-2 border border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-50 transition">
                    Voir détails
                </button>
            </div>
        </div>
    `).join('');
}

function getSeverityColor(severity) {
    if (severity === 'Sévère') return 'bg-red-100 text-red-700';
    if (severity === 'Modérée') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
}

function viewHistoryDetail(id) {
    const item = history.find(h => h.id === id);
    if (!item) return;
    
    // Populate results with history item and show
    document.getElementById('disease-name').textContent = item.name;
    document.getElementById('disease-description').textContent = item.description;
    document.getElementById('confidence-score').textContent = item.confidence + '%';
    document.getElementById('treatment-text').textContent = item.treatment;
    document.getElementById('prevention-text').textContent = item.prevention;
    document.getElementById('result-image').src = item.imageData;
    
    document.getElementById('upload-area').classList.add('hidden');
    document.getElementById('analysis-progress').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');
    
    showSection('diagnostic');
}

function clearHistory() {
    if (confirm('Voulez-vous vraiment effacer tout l\'historique ?')) {
        history = [];
        localStorage.removeItem('plantHistory');
        updateHistoryCount();
    }
}

// Authentication Functions
function switchAuthTab(tab) {
    const loginTab = document.getElementById('tab-login');
    const registerTab = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (tab === 'login') {
        loginTab.classList.add('text-emerald-600', 'border-emerald-600');
        loginTab.classList.remove('text-gray-400', 'border-transparent');
        registerTab.classList.remove('text-emerald-600', 'border-emerald-600');
        registerTab.classList.add('text-gray-400', 'border-transparent');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        registerTab.classList.add('text-emerald-600', 'border-emerald-600');
        registerTab.classList.remove('text-gray-400', 'border-transparent');
        loginTab.classList.remove('text-emerald-600', 'border-emerald-600');
        loginTab.classList.add('text-gray-400', 'border-transparent');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Check if user exists in localStorage (simulation)
    const users = JSON.parse(localStorage.getItem('plantUsers')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('plantUser', JSON.stringify(user));
        updateNavigation();
        showUserProfile();
        showNotification('Connexion réussie!', 'success');
        // Redirect to diagnostic after login
        showSection('diagnostic');
    } else {
        showNotification('Email ou mot de passe incorrect', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    
    if (password !== passwordConfirm) {
        showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
    }
    
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('plantUsers')) || [];
    if (users.find(u => u.email === email)) {
        showNotification('Cet email est déjà utilisé', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        password, // Note: In production, hash this!
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('plantUsers', JSON.stringify(users));
    
    // Auto login
    currentUser = newUser;
    localStorage.setItem('plantUser', JSON.stringify(newUser));
    
    updateNavigation();
    showNotification('Compte créé avec succès!', 'success');
    showUserProfile();
    // Redirect to diagnostic after registration
    showSection('diagnostic');
}

function showUserProfile() {
    if (!currentUser) return;
    
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('tab-login').parentElement.classList.add('hidden');
    document.getElementById('user-profile').classList.remove('hidden');
    
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-email').textContent = currentUser.email;
    document.getElementById('user-analyses').textContent = history.length;
    document.getElementById('user-since').textContent = new Date(currentUser.createdAt).getFullYear();
    
    lucide.createIcons();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('plantUser');
    
    updateNavigation();
    
    document.getElementById('user-profile').classList.add('hidden');
    document.getElementById('tab-login').parentElement.classList.remove('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('tab-login').classList.add('text-emerald-600', 'border-emerald-600');
    document.getElementById('tab-login').classList.remove('text-gray-400', 'border-transparent');
    document.getElementById('tab-register').classList.remove('text-emerald-600', 'border-emerald-600');
    document.getElementById('tab-register').classList.add('text-gray-400', 'border-transparent');
    
    // Reset forms
    document.getElementById('login-form').reset();
    document.getElementById('register-form').reset();
    
    showNotification('Déconnexion réussie', 'info');
    // Redirect to home after logout
    showSection('home');
}

function checkAuthState() {
    updateNavigation();
    if (currentUser) {
        showUserProfile();
        // If logged in, show diagnostic section by default
        showSection('diagnostic');
    } else {
        // If not logged in, show home section
        showSection('home');
    }
}

function socialLogin(provider) {
    // Simulation of social login
    const mockUser = {
        id: Date.now(),
        name: 'Utilisateur ' + provider,
        email: 'user@' + provider + '.com',
        provider: provider,
        createdAt: new Date().toISOString()
    };
    
    currentUser = mockUser;
    localStorage.setItem('plantUser', JSON.stringify(mockUser));
    updateNavigation();
    showUserProfile();
    showNotification('Connexion avec ' + provider + ' réussie!', 'success');
    // Redirect to diagnostic after social login
    showSection('diagnostic');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
        success: 'bg-emerald-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };
    
    notification.className = `fixed top-20 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
