import React, { useState, useCallback, useRef, useEffect } from 'react';


// --- Helper Components ---

const IconUpload = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

const IconPerson = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const IconClothing = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.092 1.21-.138 2.43-.138 3.662v4.5c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.092-1.21.138-2.43.138-3.662v-4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    </svg>
);

const IconCamera = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.375a9.375 9.375 0 100-18.75 9.375 9.375 0 000 18.75zM12 12.375a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.625h.008v.008h-.008v-.008z" />
    </svg>
);

const IconDownload = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);


const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-600"></div>
        <p className="mt-4 text-gray-600 font-semibold">AI is working its magic...</p>
        <p className="text-sm text-gray-500">This can take a moment.</p>
    </div>
);

const ErrorDisplay = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full bg-red-50 p-4 rounded-lg text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <p className="mt-4 text-red-700 font-semibold">An Error Occurred</p>
        <p className="text-red-600 text-sm mt-1">{message}</p>
    </div>
);

const WebcamCapture = ({ onCapture, onCancel, title }) => {
    const videoRef = useRef(null);
    const [error, setError] = useState(null);
    const [facingMode, setFacingMode] = useState('user');
    let stream = null;

    useEffect(() => {
        let stream = null;

        const startWebcam = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                        facingMode: "user",
                        aspectRatio: { ideal: 16/9 }
                    },
                    audio: false
                });
                
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play();
                    };
                }
            } catch (err) {
                console.error("Error accessing webcam:", err);
                setError(err.message);
            }
        };

        startWebcam();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleCapture = () => {
        if (!videoRef.current) return;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageData);
    };

    const retryCamera = async () => {
        setError(null);
        await startWebcam();
    };

    const switchCamera = async () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: facingMode === 'user' ? 'environment' : 'user'
                } 
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full text-center">
                    <h3 className="text-red-600 font-semibold mb-2">Camera Error</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 rounded-lg shadow-xl max-w-lg w-full">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button 
                        onClick={onCancel}
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="relative aspect-video bg-black rounded-md overflow-hidden">
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex justify-center mt-4 space-x-4">
                    <button 
                        onClick={handleCapture}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                        <IconCamera />
                        Capture Photo
                    </button>
                    <button 
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const ImageUploader = ({ title, onImageUpload, uploadedImage, icon, onClear, onWebcam, isCameraSupported }) => {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => onImageUpload(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-700">
                    {icon}
                    {title}
                </label>
                <div className="flex items-center gap-2">
                    {onWebcam && <CameraButton onClick={onWebcam} disabled={!isCameraSupported} />}
                    {uploadedImage && (
                        <button 
                            onClick={onClear}
                            className="text-sm text-red-600 font-semibold hover:text-red-800"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>
            <div className="relative flex items-center justify-center w-full h-64 bg-slate-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-600 hover:bg-indigo-100/50 transition-colors duration-300">
                {uploadedImage ? (
                    <img src={uploadedImage} alt="Upload preview" className="object-contain w-full h-full p-1 rounded-lg" />
                ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                        <IconUpload />
                        <p className="mt-2 text-sm text-gray-500">Drag & drop or <span className="font-semibold text-indigo-600">click to upload</span></p>
                        {onWebcam && (
                            <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); onWebcam(); }} className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-100">
                                <IconCamera />
                                Use Webcam
                            </button>
                        )}
                    </div>
                )}
                <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
            </div>
        </div>
    );
};

const SampleImages = ({ title, images, onSelect }) => (
    <div>
        <h3 className="text-base font-semibold text-gray-700 mb-2">{title}</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {images.map((img, index) => (
                <div key={index} className="cursor-pointer rounded-lg overflow-hidden outline-2 outline-offset-2 outline-transparent hover:outline-indigo-500 transition-all duration-200 transform hover:scale-105" onClick={() => onSelect(img.url)}>
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover aspect-square" />
                </div>
            ))}
        </div>
    </div>
);

const CameraButton = ({ onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-md text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
        <IconCamera />
        Take Photo
    </button>
);

const TextInput = ({ value, onChange, placeholder }) => (
    <div className="w-full">
        <label className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Custom Instructions (Optional)
        </label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-24 px-4 py-2 text-gray-700 bg-slate-50 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none transition-colors"
        />
    </div>
);

const examplePrompts = [
    "Make the clothing fit more loosely and add a casual style",
    "Add a vintage filter and make the colors more muted",
    "Make it look like a professional fashion photoshoot",
    "Add dramatic lighting and shadow effects"
];

const PromptSuggestions = ({ onSelect }) => (
    <div className="flex flex-wrap gap-2 mt-2">
        {examplePrompts.map((prompt, index) => (
            <button
                key={index}
                onClick={() => onSelect(prompt)}
                className="text-xs px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors"
            >
                {prompt}
            </button>
        ))}
    </div>
);

// --- Main App Component ---

export default function App() {
    const [modelImage, setModelImage] = useState(null);
    const [itemImage, setItemImage] = useState(null);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recentCreations, setRecentCreations] = useState([]);
    const [showWebcam, setShowWebcam] = useState(false);
    const [showWebcamFor, setShowWebcamFor] = useState(null); // 'model' or 'item' or null

    const [isCameraSupported, setIsCameraSupported] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [customPrompt, setCustomPrompt] = useState('');

    const sampleModels = [
        { url: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Man in grey sweater' },
        { url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Woman with curly hair' },
        { url: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Man in a suit' },
        { url: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Woman in a white top' },
    ];
    const sampleItems = [
        { url: 'https://images.pexels.com/photos/4210866/pexels-photo-4210866.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Denim jacket' },
        { url: 'https://images.pexels.com/photos/1025732/pexels-photo-1025732.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Red sunglasses' },
        { url: 'https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Black leather jacket' },
        { url: 'https://images.pexels.com/photos/1154861/pexels-photo-1154861.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Blue knitted hat' },
    ];
    
    // Function to convert image URL to base64
    const toBase64 = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };
    
    // Update the callGeminiApi function (rename it to match Stability AI usage)
    const callStabilityApi = useCallback(async (prompt, modelImg, itemImg) => {
        try {
            const response = await fetch('http://localhost:3001/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text_prompts: [{
                        text: prompt,
                        weight: 1
                    }],
                    modelImg: modelImg,
                    itemImg: itemImg
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate image');
            }

            const responseData = await response.json();
            
            if (!responseData.imageData) {
                throw new Error('Invalid response from server');
            }

            setGeneratedImage(responseData.imageData);
            setRecentCreations(prev => [responseData.imageData, ...prev.slice(0, 3)]);
        } catch (err) {
            setError(err.message);
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    // Update the handleTryOn function
    const handleTryOn = async () => {
        if (!modelImage || !itemImage) {
            setError("Please provide both a model and an item image.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        
        const defaultPrompt = `Create a photorealistic image of the model wearing the clothing item. 
        Maintain the model's pose and facial features while naturally fitting the clothing. 
        Ensure proper lighting, shadows, and texture integration. 
        Keep the original background. Style: photorealistic, high-quality fashion photography.`;
        
        const prompt = customPrompt || defaultPrompt;
        
        await callStabilityApi(prompt, modelImage, itemImage);
    };

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `virtual-try-on-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Replace the existing handleWebcamCapture function
    const handleWebcamCapture = useCallback((imgData) => {
        if (showWebcamFor === 'model') {
            setModelImage(imgData);
        } else if (showWebcamFor === 'item') {
            setItemImage(imgData);
        }
        setShowWebcamFor(null);
    }, [showWebcamFor]);

    useEffect(() => {
        // Check if getUserMedia is supported
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.log('getUserMedia supported');
        } else {
            console.log('getUserMedia not supported');
        }
    }, []);

    useEffect(() => {
        const checkCameraSupport = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const hasCamera = devices.some(device => device.kind === 'videoinput');
                setIsCameraSupported(hasCamera);
            } catch (err) {
                console.error('Camera check failed:', err);
                setCameraError(err.message);
                setIsCameraSupported(false);
            }
        };

        checkCameraSupport();
    }, []);

    return (
        <>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                    
                    body {
                        font-family: 'Inter', sans-serif;
                        background-color: #f8fafc; /* Tailwind's slate-50 */
                    }

                    /* Simple fade-in animation for page load */
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(15px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    .fade-in-load {
                        animation: fadeIn 0.6s ease-out forwards;
                    }
                    
                    /* Custom scrollbar for a more polished look */
                    ::-webkit-scrollbar {
                        width: 8px;
                        height: 8px;
                    }
                    ::-webkit-scrollbar-track {
                        background: #e2e8f0; /* slate-200 */
                    }
                    ::-webkit-scrollbar-thumb {
                        background: #6366f1; /* indigo-500 */
                        border-radius: 10px;
                        border: 2px solid #e2e8f0;
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background: #4f46e5; /* indigo-600 */
                    }
                `}
            </style>
            <div className="min-h-screen bg-slate-50 font-sans p-4 sm:p-6 lg:p-8">
                {showWebcamFor && (
                    <WebcamCapture 
                        onCapture={handleWebcamCapture}
                        onCancel={() => setShowWebcamFor(null)}
                        title={showWebcamFor === 'model' ? 'Take Your Photo' : 'Take Item Photo'}
                    />
                )}
                <div className="w-full max-w-screen-2xl mx-auto fade-in-load">
                    <header className="text-center mb-8">
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">Virtual Try-On AI <span className="text-3xl">✨</span></h1>
                        <p className="text-gray-500 text-lg">The future of fashion is here. Powered by Gemini.</p>
                    </header>

                    <main className="bg-white rounded-2xl shadow-2xl shadow-indigo-100 p-6 md:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                            
                            {/* --- Input Column --- */}
                            <div className="flex flex-col gap-6 lg:col-span-5">
                                <ImageUploader
                                    title="1. Your Photo"
                                    onImageUpload={setModelImage}
                                    uploadedImage={modelImage}
                                    icon={<IconPerson />}
                                    onClear={() => setModelImage(null)}
                                    onWebcam={() => setShowWebcamFor('model')}
                                    isCameraSupported={isCameraSupported}
                                />
                                <SampleImages title="Or try a sample model:" images={sampleModels} onSelect={setModelImage} />
                                <ImageUploader
                                    title="2. Clothing / Accessory"
                                    onImageUpload={setItemImage}
                                    uploadedImage={itemImage}
                                    icon={<IconClothing />}
                                    onClear={() => setItemImage(null)}
                                    onWebcam={() => setShowWebcamFor('item')}
                                    isCameraSupported={isCameraSupported}
                                />
                                <SampleImages title="Or try a sample item:" images={sampleItems} onSelect={setItemImage} />
                            </div>

                            {/* --- Output Column --- */}
                            <div className="flex flex-col lg:col-span-7">
                                <TextInput
                                    value={customPrompt}
                                    onChange={setCustomPrompt}
                                    placeholder="Add custom instructions for the AI (e.g., 'Make the clothing fit looser' or 'Add a vintage filter'). Leave empty to use default settings."
                                />
                                <PromptSuggestions onSelect={setCustomPrompt} />
                                <button
                                    onClick={handleTryOn}
                                    disabled={!modelImage || !itemImage || isLoading}
                                    className="w-full mt-4 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 ease-in-out hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none inline-flex items-center justify-center gap-2"
                                >
                                    {isLoading ? 'Generating...' : '✨ Try It On!'}
                                </button>
                                
                                <div className="mt-6 flex-grow flex flex-col">
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="text-lg font-semibold text-gray-700">3. The Result</h2>
                                        {generatedImage && !isLoading && 
                                            <button onClick={handleDownload} className="p-2 rounded-full hover:bg-gray-200 transition-colors" title="Download Image">
                                                <IconDownload />
                                            </button>
                                        }
                                    </div>
                                    <div className="w-full flex-grow min-h-[36rem] bg-slate-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-2 relative">
                                        {isLoading && <LoadingSpinner />}
                                        {error && !isLoading && <ErrorDisplay message={error} />}
                                        {generatedImage && !isLoading && !error && (
                                            <img src={generatedImage} alt="Generated virtual try-on" className="object-contain max-h-full max-w-full rounded-md" />
                                        )}
                                        {!isLoading && !error && !generatedImage && (
                                            <div className="text-center text-gray-500 p-4">
                                                <p className="font-semibold">Your AI-powered virtual try-on will appear here.</p>
                                                <p className="text-sm mt-1">Upload images and click the "Try It On!" button to start.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {recentCreations.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent Creations</h3>
                                        <div className="grid grid-cols-4 gap-4">
                                            {recentCreations.map((imgSrc, index) => (
                                                <img key={index} src={imgSrc} alt={`Recent creation ${index + 1}`} className="rounded-lg object-cover w-full aspect-square border border-gray-200 transition-all duration-300 hover:shadow-lg hover:scale-105" />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

