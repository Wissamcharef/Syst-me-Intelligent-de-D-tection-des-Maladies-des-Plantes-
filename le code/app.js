const { useState, useEffect, useRef } = React;

// Translations data
const translations = {
  fr: {
    home: "Accueil",
    diagnostic: "Diagnostic",
    history: "Historique",
    login: "Connexion",
    register: "Inscription",
    logout: "Déconnexion",
    startAnalysis: "Commencer l'Analyse",
    accuracy: "Précision",
    diseases: "Maladies Détectées",
    responseTime: "Temps Réponse",
    intelligentDetection: "Détection Intelligente des ",
    plantDiseases: "Maladies des Plantes",
    homeDesc:
      "Utilisez l'intelligence artificielle pour identifier instantanément les maladies parasites et les carences nutritives. Notre système basé sur le Deep Learning assure une scalabilité et une précision optimales.",
    imageAnalysis: "Analyse d'Image",
    uploadDesc:
      "Prenez une photo ou téléchargez une image de la feuille à analyser",
    dragDrop: "Glissez-déposez votre image ici",
    orClick: "ou cliquez pour parcourir (JPG, PNG, max 10MB)",
    selectFile: "Sélectionner un fichier",
    useCamera: "Utiliser l'appareil photo",
    capture: "Capturer",
    close: "Fermer",
    analyzing: "Analyse en cours...",
    initModel: "Initialisation du modèle Deep Learning",
    step1: "Prétraitement de l'image",
    step2: "Extraction des caractéristiques (CNN)",
    step3: "Classification et prédiction",
    step4: "Génération des recommandations",
    newAnalysis: "Nouvelle Analyse",
    similarDiseases: "Maladies Similaires Détectées",
    recommendedTreatment: "Traitement Recommandé",
    prevention: "Prévention",
    severity: "Sévérité",
    processedIn: "Traité en",
    email: "Email",
    password: "Mot de passe",
    rememberMe: "Se souvenir de moi",
    forgotPassword: "Mot de passe oublié?",
    loginBtn: "Se connecter",
    fullName: "Nom complet",
    confirmPassword: "Confirmer le mot de passe",
    acceptTerms: "J'accepte les conditions d'utilisation",
    createAccount: "Créer un compte",
    analyses: "Analyses",
    memberSince: "Membre depuis",
    historyTitle: "Historique des Diagnostics",
    analysesCount: "analyses effectuées",
    clearHistory: "Effacer l'historique",
    noHistory: "Aucun historique",
    startFirst: "Commencez par analyser votre première plante",
    newAnalysisBtn: "Nouvelle Analyse",
    viewDetails: "Voir détails",
    connexion: "Connexion / Inscription",
  },
  en: {
    home: "Home",
    diagnostic: "Diagnosis",
    history: "History",
    login: "Login",
    register: "Sign Up",
    logout: "Logout",
    startAnalysis: "Start Analysis",
    accuracy: "Accuracy",
    diseases: "Diseases Detected",
    responseTime: "Response Time",
    intelligentDetection: "Intelligent Detection of ",
    plantDiseases: "Plant Diseases",
    homeDesc:
      "Use artificial intelligence to instantly identify parasitic diseases and nutrient deficiencies. Our Deep Learning-based system ensures optimal scalability and accuracy.",
    imageAnalysis: "Image Analysis",
    uploadDesc: "Take a photo or upload an image of the leaf to analyze",
    dragDrop: "Drag and drop your image here",
    orClick: "or click to browse (JPG, PNG, max 10MB)",
    selectFile: "Select File",
    useCamera: "Use Camera",
    capture: "Capture",
    close: "Close",
    analyzing: "Analysis in progress...",
    initModel: "Initializing Deep Learning model",
    step1: "Image preprocessing",
    step2: "Feature extraction (CNN)",
    step3: "Classification and prediction",
    step4: "Generating recommendations",
    newAnalysis: "New Analysis",
    similarDiseases: "Similar Diseases Detected",
    recommendedTreatment: "Recommended Treatment",
    prevention: "Prevention",
    severity: "Severity",
    processedIn: "Processed in",
    email: "Email",
    password: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    loginBtn: "Sign In",
    fullName: "Full Name",
    confirmPassword: "Confirm Password",
    acceptTerms: "I accept the terms of use",
    createAccount: "Create Account",
    analyses: "Analyses",
    memberSince: "Member since",
    historyTitle: "Diagnosis History",
    analysesCount: "analyses performed",
    clearHistory: "Clear History",
    noHistory: "No history",
    startFirst: "Start by analyzing your first plant",
    newAnalysisBtn: "New Analysis",
    viewDetails: "View details",
    connexion: "Login / Sign Up",
  },
};

// Disease Database
const diseaseDatabase = [
  {
    id: 1,
    name: "Mildiou de la tomate",
    nameEn: "Tomato Late Blight",
    scientificName: "Phytophthora infestans",
    severity: "Sévère",
    severityEn: "Severe",
    confidence: 98.5,
    description:
      "Maladie fongique dévastatrice causée par l'oomycète Phytophthora infestans. Se manifeste par des taches sombres irrégulières sur les feuilles et les fruits.",
    descriptionEn:
      "Devastating fungal-like disease caused by Phytophthora infestans. Manifests as irregular dark spots on leaves and fruits.",
    treatment:
      "Application de fongicide à base de cuivre (Bordeaux). Retirer immédiatement les feuilles infectées. Assurer une circulation d'air optimale.",
    treatmentEn:
      "Apply copper-based fungicide (Bordeaux). Remove infected leaves immediately. Ensure optimal air circulation.",
    prevention:
      "Espacer les plants (60-80cm). Arroser au pied uniquement. Utiliser des paillis pour éviter les éclaboussures de sol.",
    preventionEn:
      "Space plants (60-80cm). Water at base only. Use mulch to prevent soil splash.",
  },
  {
    id: 2,
    name: "Rouille du blé",
    nameEn: "Wheat Rust",
    scientificName: "Puccinia triticina",
    severity: "Modérée",
    severityEn: "Moderate",
    confidence: 94.2,
    description:
      "Maladie fongique se présentant sous forme de pustules orangées sur les feuilles, réduisant la photosynthèse.",
    descriptionEn:
      "Fungal disease appearing as orange pustules on leaves, reducing photosynthesis.",
    treatment: "Fongicides azolés. Retirer les plantes fortement infectées.",
    treatmentEn: "Azole fungicides. Remove heavily infected plants.",
    prevention:
      "Varietés résistantes. Rotation des cultures. Éviter l'excès d'azote.",
    preventionEn: "Resistant varieties. Crop rotation. Avoid excess nitrogen.",
  },
  {
    id: 3,
    name: "Oïdium",
    nameEn: "Powdery Mildew",
    scientificName: "Erysiphales",
    severity: "Modérée",
    severityEn: "Moderate",
    confidence: 92.1,
    description:
      "Poudre blanche caractéristique sur les feuilles, tiges et fruits. Réduit la croissance.",
    descriptionEn:
      "Characteristic white powder on leaves, stems and fruits. Reduces growth.",
    treatment:
      "Soufre ou bicarbonate de potassium. Lait dilué (1:10) comme alternative bio.",
    treatmentEn:
      "Sulfur or potassium bicarbonate. Diluted milk (1:10) as organic alternative.",
    prevention:
      "Ensoleillement maximal. Éviter l'humidité excessive. Variétés résistantes.",
    preventionEn:
      "Maximum sunlight. Avoid excessive humidity. Resistant varieties.",
  },
];

// Severity colors helper
const getSeverityColor = (severity, lang) => {
  const sev = lang === "fr" ? severity : severity;
  if (sev === "Sévère" || sev === "Severe") return "bg-red-100 text-red-700";
  if (sev === "Modérée" || sev === "Moderate")
    return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-700";
};

// Notification Component
const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "bg-[#486F38]",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`fixed top-20 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 notification`}
    >
      {message}
    </div>
  );
};

// Navigation Component
const Navigation = ({
  currentUser,
  currentLang,
  setCurrentLang,
  setCurrentSection,
  setMobileMenuOpen,
  mobileMenuOpen,
  handleLogout,
}) => {
  const t = translations[currentLang];

  const handleStartAnalysis = () => {
    if (currentUser) {
      setCurrentSection("diagnostic");
    } else {
      setCurrentSection("auth");
    }
  };

  return (
    <nav className="fixed w-full z-50 glass-effect border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCurrentSection("home")}
          >
            <i data-lucide="leaf" className="w-8 h-8 text-[#486F38]"></i>
            <span className="font-bold text-xl text-[#486F38]">PlantAI</span>
          </div>

          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => setCurrentSection("home")}
              className="text-gray-700 hover:text-[#486F38] font-medium transition"
            >
              {t.home}
            </button>
            {currentUser && (
              <>
                <button
                  onClick={() => setCurrentSection("diagnostic")}
                  className="text-gray-700 hover:text-[#486F38] font-medium transition"
                >
                  {t.diagnostic}
                </button>
                <button
                  onClick={() => setCurrentSection("history")}
                  className="text-gray-700 hover:text-[#486F38] font-medium transition"
                >
                  {t.history}
                </button>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setCurrentLang(currentLang === "fr" ? "en" : "fr")}
              className="px-3 py-2 border border-[#486F38] text-[#486F38] rounded-lg font-medium hover:bg-[#486F38] hover:text-white transition flex items-center gap-2"
            >
              <i data-lucide="globe" className="w-4 h-4"></i>
              {currentLang === "fr" ? "EN" : "FR"}
            </button>

            {currentUser ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 border-2 border-[#486F38] text-[#486F38] rounded-lg font-medium hover:bg-[#486F38] hover:text-white transition flex items-center gap-2"
              >
                <i data-lucide="log-out" className="w-4 h-4"></i>
                {t.logout}
              </button>
            ) : (
              <button
                onClick={() => setCurrentSection("auth")}
                className="px-4 py-2 bg-[#486F38] text-white rounded-lg font-medium hover:bg-[#3d5d2f] transition flex items-center gap-2"
              >
                <i data-lucide="user" className="w-4 h-4"></i>
                {t.login}
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setCurrentLang(currentLang === "fr" ? "en" : "fr")}
              className="px-2 py-1 border border-[#486F38] text-[#486F38] rounded text-sm font-medium"
            >
              {currentLang === "fr" ? "EN" : "FR"}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <i
                data-lucide={mobileMenuOpen ? "x" : "menu"}
                className="w-6 h-6"
              ></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => {
                setCurrentSection("home");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-[#486F38]/10 rounded-md"
            >
              {t.home}
            </button>
            {currentUser && (
              <>
                <button
                  onClick={() => {
                    setCurrentSection("diagnostic");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-[#486F38]/10 rounded-md"
                >
                  {t.diagnostic}
                </button>
                <button
                  onClick={() => {
                    setCurrentSection("history");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-[#486F38]/10 rounded-md"
                >
                  {t.history}
                </button>
              </>
            )}
            {currentUser ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium"
              >
                {t.logout}
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentSection("auth");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-white bg-[#486F38] rounded-md font-medium"
              >
                {t.connexion}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Home Section Component
const HomeSection = ({ currentLang, setCurrentSection, currentUser }) => {
  const t = translations[currentLang];

  const handleStartAnalysis = () => {
    if (currentUser) {
      setCurrentSection("diagnostic");
    } else {
      setCurrentSection("auth");
    }
  };

  return (
    <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-[#F5F5DC]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              {t.intelligentDetection}
              <span className="text-[#486F38]">{t.plantDiseases}</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {t.homeDesc}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleStartAnalysis}
                className="px-8 py-4 gradient-bg text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition flex items-center gap-2"
              >
                <i data-lucide="scan-line" className="w-5 h-5"></i>
                {t.startAnalysis}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-300">
              <div>
                <div className="text-3xl font-bold text-[#486F38]">98.5%</div>
                <div className="text-sm text-gray-600">{t.accuracy}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#486F38]">50+</div>
                <div className="text-sm text-gray-600">{t.diseases}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#486F38]">&lt;2s</div>
                <div className="text-sm text-gray-600">{t.responseTime}</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 gradient-bg rounded-3xl transform rotate-3 opacity-20"></div>
            <img
              src="plant.jpg"
              alt="Healthy plant"
              className="relative rounded-3xl shadow-2xl w-full object-cover h-[500px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Diagnostic Section Component
const DiagnosticSection = ({
  currentLang,
  currentUser,
  setHistory,
  setNotification,
  history,
}) => {
  const t = translations[currentLang];
  const [currentView, setCurrentView] = useState("upload"); // upload, analyzing, results
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const analyzeWithML = () => {
    const random = Math.random() * 100;
    let selectedDisease;

    if (random > 70) selectedDisease = diseaseDatabase[0];
    else if (random > 40) selectedDisease = diseaseDatabase[1];
    else selectedDisease = diseaseDatabase[2];

    const confidence = Math.min(
      99,
      selectedDisease.confidence + (Math.random() * 4 - 2)
    );

    return {
      ...selectedDisease,
      confidence: confidence.toFixed(1),
      timestamp: new Date().toISOString(),
      id: Date.now(),
    };
  };

  const processImage = (file) => {
    if (!file.type.startsWith("image/")) {
      setNotification({
        message:
          currentLang === "fr"
            ? "Veuillez sélectionner une image valide"
            : "Please select a valid image",
        type: "error",
      });
      return;
    }

    setCurrentView("analyzing");
    setAnalysisStep(0);

    // Simulate steps
    setTimeout(() => setAnalysisStep(1), 1000);
    setTimeout(() => setAnalysisStep(2), 2000);
    setTimeout(() => setAnalysisStep(3), 3000);

    setTimeout(() => {
      const result = analyzeWithML();
      setAnalysisResult(result);
      setCurrentView("results");

      // Save to history
      const reader = new FileReader();
      reader.onload = (e) => {
        const historyItem = { ...result, imageData: e.target.result };
        const newHistory = [historyItem, ...history].slice(0, 50);
        localStorage.setItem("plantHistory", JSON.stringify(newHistory));
        setHistory(newHistory);
      };
      reader.readAsDataURL(file);

      setNotification({
        message:
          currentLang === "fr" ? "Analyse terminée!" : "Analysis complete!",
        type: "success",
      });
    }, 4000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSelectedImage(ev.target.result);
      reader.readAsDataURL(file);
      processImage(file);
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch (err) {
      setNotification({
        message:
          currentLang === "fr"
            ? "Impossible d'accéder à la caméra"
            : "Cannot access camera",
        type: "error",
      });
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], "camera-capture.jpg", {
        type: "image/jpeg",
      });
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
      processImage(file);
      closeCamera();
    }, "image/jpeg");
  };

  const resetAnalysis = () => {
    setCurrentView("upload");
    setAnalysisResult(null);
    setAnalysisStep(0);
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const steps = [
    { text: t.step1, delay: 0 },
    { text: t.step2, delay: 1000 },
    {
      text:
        currentLang === "fr"
          ? "ResNet50 classification..."
          : "ResNet50 classification...",
      delay: 2000,
    },
    { text: t.step4, delay: 3000 },
  ];

  return (
    <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-[#F5F5DC]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t.imageAnalysis}
          </h2>
          <p className="text-gray-600">{t.uploadDesc}</p>
        </div>

        {currentView === "upload" && (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-[#486F38]/50 rounded-3xl p-12 text-center hover:border-[#486F38] transition bg-[#486F38]/10 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add(
                  "border-[#486F38]",
                  "bg-[#486F38]/20"
                );
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove(
                  "border-[#486F38]",
                  "bg-[#486F38]/20"
                );
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove(
                  "border-[#486F38]",
                  "bg-[#486F38]/20"
                );
                const files = Array.from(e.dataTransfer.files);
                if (files[0]) {
                  const reader = new FileReader();
                  reader.onload = (ev) => setSelectedImage(ev.target.result);
                  reader.readAsDataURL(files[0]);
                  processImage(files[0]);
                }
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
              <div className="w-20 h-20 bg-[#486F38]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i
                  data-lucide="upload-cloud"
                  className="w-10 h-10 text-[#486F38]"
                ></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.dragDrop}
              </h3>
              <p className="text-gray-500 mb-4">{t.orClick}</p>
              <button className="px-6 py-2 bg-[#486F38] text-white rounded-lg font-medium hover:bg-[#3d5d2f] transition">
                {t.selectFile}
              </button>
            </div>

            <button
              onClick={openCamera}
              className="w-full py-3 border-2 border-gray-300 rounded-xl flex items-center justify-center gap-2 hover:border-[#486F38] hover:text-[#486F38] transition bg-white"
            >
              <i data-lucide="camera" className="w-5 h-5"></i>
              {t.useCamera}
            </button>
          </div>
        )}

        {cameraOpen && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-4 max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">{t.useCamera}</h3>
                <button
                  onClick={closeCamera}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <i data-lucide="x" className="w-5 h-5"></i>
                </button>
              </div>
              <video
                ref={videoRef}
                className="w-full rounded-lg bg-black"
                autoPlay
                playsInline
              ></video>
              <button
                onClick={capturePhoto}
                className="mt-4 w-full py-3 gradient-bg text-white rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <i data-lucide="camera" className="w-5 h-5"></i>
                {t.capture}
              </button>
            </div>
          </div>
        )}

        {currentView === "analyzing" && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-4 border-[#486F38]/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#486F38] rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i
                    data-lucide="brain"
                    className="w-12 h-12 text-[#486F38]"
                  ></i>
                </div>
              </div>
            </div>
            <h3 className="text-center font-semibold text-lg mb-2">
              {t.analyzing}
            </h3>
            <p className="text-center text-gray-500 text-sm mb-4">
              {t.initModel}
            </p>

            <div className="space-y-3 max-w-md mx-auto">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    analysisStep >= idx
                      ? "bg-[#486F38]/10 border-l-4 border-[#486F38]"
                      : "bg-[#F5F5DC]"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                      analysisStep >= idx ? "bg-[#486F38]" : "bg-gray-300"
                    }`}
                  >
                    {analysisStep > idx ? "✓" : idx + 1}
                  </div>
                  <span className="text-sm">{step.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === "results" && analysisResult && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <img
                    src={selectedImage}
                    alt="Analyzed plant"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#486F38] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <i data-lucide="activity" className="w-4 h-4"></i>
                    {analysisResult.confidence}%
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(
                        analysisResult.severity,
                        currentLang
                      )}`}
                    >
                      {currentLang === "fr"
                        ? analysisResult.severity
                        : analysisResult.severityEn}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {t.processedIn} {(1.2 + Math.random()).toFixed(1)}s
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentLang === "fr"
                      ? analysisResult.name
                      : analysisResult.nameEn}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {currentLang === "fr"
                      ? analysisResult.description
                      : analysisResult.descriptionEn}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <i
                          data-lucide="spray-can"
                          className="w-4 h-4 text-blue-600"
                        ></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">
                          {t.recommendedTreatment}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {currentLang === "fr"
                            ? analysisResult.treatment
                            : analysisResult.treatmentEn}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <i
                          data-lucide="shield"
                          className="w-4 h-4 text-amber-600"
                        ></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">
                          {t.prevention}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {currentLang === "fr"
                            ? analysisResult.prevention
                            : analysisResult.preventionEn}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={resetAnalysis}
                    className="mt-6 w-full py-3 border-2 border-gray-200 rounded-xl font-medium hover:border-[#486F38] hover:text-[#486F38] transition"
                  >
                    {t.newAnalysis}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Auth Section Component
const AuthSection = ({
  currentLang,
  setCurrentUser,
  setCurrentSection,
  setNotification,
}) => {
  const t = translations[currentLang];
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("plantUsers")) || [];
    const user = users.find(
      (u) => u.email === loginData.email && u.password === loginData.password
    );

    if (user) {
      setCurrentUser(user);
      localStorage.setItem("plantUser", JSON.stringify(user));
      setNotification({
        message:
          currentLang === "fr" ? "Connexion réussie!" : "Login successful!",
        type: "success",
      });
      setCurrentSection("diagnostic");
    } else {
      setNotification({
        message:
          currentLang === "fr"
            ? "Email ou mot de passe incorrect"
            : "Invalid email or password",
        type: "error",
      });
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setNotification({
        message:
          currentLang === "fr"
            ? "Les mots de passe ne correspondent pas"
            : "Passwords do not match",
        type: "error",
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem("plantUsers")) || [];
    if (users.find((u) => u.email === registerData.email)) {
      setNotification({
        message:
          currentLang === "fr"
            ? "Cet email est déjà utilisé"
            : "This email is already in use",
        type: "error",
      });
      return;
    }

    const newUser = {
      id: Date.now(),
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("plantUsers", JSON.stringify(users));
    setCurrentUser(newUser);
    localStorage.setItem("plantUser", JSON.stringify(newUser));
    setNotification({
      message:
        currentLang === "fr"
          ? "Compte créé avec succès!"
          : "Account created successfully!",
      type: "success",
    });
    setCurrentSection("diagnostic");
  };

  const socialLogin = (provider) => {
    const mockUser = {
      id: Date.now(),
      name: `User ${provider}`,
      email: `user@${provider}.com`,
      provider: provider,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(mockUser);
    localStorage.setItem("plantUser", JSON.stringify(mockUser));
    setNotification({
      message: `${provider} ${
        currentLang === "fr" ? "connexion réussie!" : "login successful!"
      }`,
      type: "success",
    });
    setCurrentSection("diagnostic");
  };

  return (
    <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-[#F5F5DC]">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex gap-4 mb-8 border-b">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 pb-4 text-center font-semibold border-b-2 transition ${
                activeTab === "login"
                  ? "text-[#486F38] border-[#486F38]"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              }`}
            >
              {t.login}
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 pb-4 text-center font-semibold border-b-2 transition ${
                activeTab === "register"
                  ? "text-[#486F38] border-[#486F38]"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              }`}
            >
              {t.register}
            </button>
          </div>

          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.email}
                </label>
                <div className="relative">
                  <i
                    data-lucide="mail"
                    className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  ></i>
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#486F38] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.password}
                </label>
                <div className="relative">
                  <i
                    data-lucide="lock"
                    className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  ></i>
                  <input
                    type="password"
                    required
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#486F38] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#486F38] border-gray-300 rounded focus:ring-[#486F38]"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {t.rememberMe}
                  </span>
                </label>
                <a href="#" className="text-sm text-[#486F38] hover:underline">
                  {t.forgotPassword}
                </a>
              </div>
              <button
                type="submit"
                className="w-full py-3 gradient-bg text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                {t.loginBtn}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.fullName}
                </label>
                <div className="relative">
                  <i
                    data-lucide="user"
                    className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  ></i>
                  <input
                    type="text"
                    required
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#486F38] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.email}
                </label>
                <div className="relative">
                  <i
                    data-lucide="mail"
                    className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  ></i>
                  <input
                    type="email"
                    required
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#486F38] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.password}
                </label>
                <div className="relative">
                  <i
                    data-lucide="lock"
                    className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  ></i>
                  <input
                    type="password"
                    required
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#486F38] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.confirmPassword}
                </label>
                <div className="relative">
                  <i
                    data-lucide="lock"
                    className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  ></i>
                  <input
                    type="password"
                    required
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#486F38] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 gradient-bg text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                {t.createAccount}
              </button>
            </form>
          )}

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => socialLogin("google")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm font-medium">Google</span>
              </button>
              <button
                onClick={() => socialLogin("github")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// History Section Component
const HistorySection = ({
  currentLang,
  history,
  setHistory,
  setCurrentSection,
}) => {
  const t = translations[currentLang];

  const clearHistory = () => {
    if (
      confirm(
        currentLang === "fr"
          ? "Voulez-vous vraiment effacer tout l'historique ?"
          : "Do you really want to clear all history?"
      )
    ) {
      setHistory([]);
      localStorage.removeItem("plantHistory");
    }
  };

  return (
    <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-[#F5F5DC]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {t.historyTitle}
            </h2>
            <p className="text-gray-600 mt-1">
              {history.length} {t.analysesCount}
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
            >
              <i data-lucide="trash-2" className="w-4 h-4"></i>
              {t.clearHistory}
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i
                data-lucide="clipboard-list"
                className="w-12 h-12 text-gray-400"
              ></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t.noHistory}
            </h3>
            <p className="text-gray-600 mb-4">{t.startFirst}</p>
            <button
              onClick={() => setCurrentSection("diagnostic")}
              className="px-6 py-2 bg-[#486F38] text-white rounded-lg hover:bg-[#3d5d2f] transition"
            >
              {t.newAnalysisBtn}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:-translate-y-1 hover:shadow-xl transition"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={item.imageData}
                    alt={currentLang === "fr" ? item.name : item.nameEn}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg text-xs font-bold text-[#486F38]">
                    {item.confidence}%
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleDateString(
                        currentLang === "fr" ? "fr-FR" : "en-US"
                      )}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(
                        item.severity,
                        currentLang
                      )}`}
                    >
                      {currentLang === "fr" ? item.severity : item.severityEn}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">
                    {currentLang === "fr" ? item.name : item.nameEn}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {currentLang === "fr"
                      ? item.description
                      : item.descriptionEn}
                  </p>
                  <button
                    onClick={() => setCurrentSection("diagnostic")}
                    className="w-full py-2 border border-[#486F38] text-[#486F38] rounded-lg text-sm font-medium hover:bg-[#486F38] hover:text-white transition"
                  >
                    {t.viewDetails}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Main App Component
const App = () => {
  const [currentSection, setCurrentSection] = useState("home");
  const [currentLang, setCurrentLang] = useState(
    localStorage.getItem("plantLang") || "fr"
  );
  const [currentUser, setCurrentUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Load user
    const savedUser = localStorage.getItem("plantUser");
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    // Load history
    const savedHistory = localStorage.getItem("plantHistory");
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    // Save language preference
    localStorage.setItem("plantLang", currentLang);
  }, [currentLang]);

  useEffect(() => {
    // Re-initialize Lucide icons after render
    if (window.lucide) {
      lucide.createIcons();
    }
  }, [currentSection, currentLang, mobileMenuOpen, notification]);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("plantUser");
    setNotification({
      message:
        currentLang === "fr" ? "Déconnexion réussie" : "Logout successful",
      type: "info",
    });
    setCurrentSection("home");
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      <Navigation
        currentUser={currentUser}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        setCurrentSection={setCurrentSection}
        setMobileMenuOpen={setMobileMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
        handleLogout={handleLogout}
      />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {currentSection === "home" && (
        <HomeSection
          currentLang={currentLang}
          setCurrentSection={setCurrentSection}
          currentUser={currentUser}
        />
      )}

      {currentSection === "diagnostic" && (
        <DiagnosticSection
          currentLang={currentLang}
          currentUser={currentUser}
          setHistory={setHistory}
          history={history}
          setNotification={setNotification}
        />
      )}

      {currentSection === "auth" && (
        <AuthSection
          currentLang={currentLang}
          setCurrentUser={setCurrentUser}
          setCurrentSection={setCurrentSection}
          setNotification={setNotification}
        />
      )}

      {currentSection === "history" && (
        <HistorySection
          currentLang={currentLang}
          history={history}
          setHistory={setHistory}
          setCurrentSection={setCurrentSection}
        />
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
