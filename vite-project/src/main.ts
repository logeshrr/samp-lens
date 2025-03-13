import { bootstrapCameraKit } from '@snap/camera-kit';

let cameraKit: any;
let session: any;
let canvas: HTMLCanvasElement | null = null;
let isCameraRunning = false; // Track camera status

const lensMapping: Record<string, { lensId: string; groupId?: string }> = {
    "clickableImage": { lensId: "2f5afc75-f7f9-4484-a0bc-e7585f54d8f3", groupId: "de46e910-60ff-4175-a85b-3303602528c4" },
    "clickableImage1": { lensId: "b4a54e5d-8d05-4f3e-974c-c76e3b91fe5f", groupId: "group2" },
    "clickableImage2": { lensId: "2566fb54-d7a0-4403-a07d-8c27d9c91286", groupId: "group3" }
};

window.addEventListener("beforeunload", () => {
    const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    canvas.removeAttribute("data-offscreen"); // Allow re-transfer
});


document.addEventListener('DOMContentLoaded', () => {
    const clickableImages = document.querySelectorAll('.clickableImage');
    canvas = document.getElementById('canvas') as HTMLCanvasElement;

    clickableImages.forEach(image => {
        image.addEventListener('click', async (event) => {
            event.preventDefault();
            const target = event.target as HTMLImageElement;
            const imageId = target.id;

            if (!lensMapping[imageId]) {
                console.error(`❌ Lens mapping not found for: ${imageId}`);
                return;
            }

            const { lensId, groupId } = lensMapping[imageId];

            // If camera is not running, start a fresh session
            if (!isCameraRunning) {
                await startCamera();
            }

            // Apply the lens
            await loadLens(lensId, groupId);
        });
    });

    console.log('✅ Click event added to all images.');

    // Back button event listener
    document.getElementById('backButton')?.addEventListener('click', async () => {
        console.log('🔙 Back button clicked. Stopping camera...');
        await stopCamera(); // Stop camera when going back
    });
});

// Function to start the camera session
async function startCamera() {
    try {
        if (!canvas) {
            console.error('❌ Canvas element not found.');
            return;
        }

        console.log('🎥 Initializing Camera Kit...');
        cameraKit = await bootstrapCameraKit({
            apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQxNjA4MDQ3LCJzdWIiOiI0MTEwYmIwMy1jZGE3LTRmNTctYWVhZS0yYWFhNjZiNjE2ZDB-U1RBR0lOR35hZjA1OGFjYy03YWQ2LTRiY2UtOTE1ZS1jYjlhOWEyZGJhMTgifQ.cjC5sQ9wlP-xlpPWdw65j1W9D6dpeuH754qatmfsOTE', // Replace with your actual API token
        });

        console.log('✅ Camera Kit initialized:', cameraKit);

        // Reuse existing session instead of creating multiple
        if (!session) {
            session = await cameraKit.createSession({ liveRenderTarget: canvas });
            console.log('✅ Camera session created:', session);
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log('🎥 Media stream obtained:', mediaStream);

        await session.setSource(mediaStream);
        console.log('🔄 Media stream set as session source.');

        await session.play();
        isCameraRunning = true; // Mark camera as running
        console.log('▶️ Session is now playing.');
    } catch (error) {
        console.error('❌ Error during AR session initialization:', error);
    }
}

// Function to load and apply a lens
async function loadLens(lensId: string, lensGroupId?: string) {
    if (!session) {
        console.error('❌ Session not started yet.');
        return;
    }

    console.log(`🔄 Loading Lens: ${lensId}, Group: ${lensGroupId || 'No Group'}`);

    try {
        let lens;
        if (lensGroupId) {
            lens = await cameraKit.lensRepository.loadLens(lensId, lensGroupId);
        } else {
            lens = await cameraKit.lensRepository.loadLens(lensId);
        }

        await session.applyLens(lens);
        console.log('✅ Lens applied successfully.');
    } catch (error) {
        console.error('❌ Error loading lens:', error);
    }
}

// Function to stop and reset the camera session
async function stopCamera() {
    if (session) {
        console.log('⏸️ Stopping and resetting camera session...');

        try {
            await session.pause();  // Pause the session
            await session.destroy();  // Destroy session completely
            console.log('🚫 Camera session destroyed.');
        } catch (error) {
            console.error('❌ Error stopping camera session:', error);
        }

        session = null; // Reset session
        isCameraRunning = false; // Mark camera as stopped
    }
}
