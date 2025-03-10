import { bootstrapCameraKit } from '@snap/camera-kit';

(async function () {
  try {
    console.log("🚀 Initializing Camera Kit...");
    
    const apiToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQxNjA4MDQ3LCJzdWIiOiI0MTEwYmIwMy1jZGE3LTRmNTctYWVhZS0yYWFhNjZiNjE2ZDB-U1RBR0lOR35hZjA1OGFjYy03YWQ2LTRiY2UtOTE1ZS1jYjlhOWEyZGJhMTgifQ.cjC5sQ9wlP-xlpPWdw65j1W9D6dpeuH754qatmfsOTE';
    
    // Initialize Camera Kit
    const cameraKit = await bootstrapCameraKit({ apiToken });

    // Get the HTML canvas
    const liveRenderTarget = document.getElementById('canvas') as HTMLCanvasElement;
    if (!liveRenderTarget) {
      throw new Error("Canvas element not found!");
    }

    // Create a camera session
    console.log("📷 Creating Camera Kit session...");
    const session = await cameraKit.createSession({ liveRenderTarget });

    // Get user webcam
    console.log("🎥 Accessing user media...");
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' }
    });

    // Set media source
    await session.setSource(mediaStream);
    await session.play();
    console.log("✅ Camera session started.");

    // Lens ID and Group ID
    const lensId = 'd8ebdeff-1ab5-4a93-b389-ddd7d5964e79';
    const lensGroupId = '72a177a7-1127-4821-ab56-ce6c9c24a9a1';

    // Load Lens with error handling
    console.log(`🎭 Loading Lens ID: ${lensId} from Group ID: ${lensGroupId}...`);
    
    try {
      const lens = await cameraKit.lensRepository.loadLens(lensId, lensGroupId);
      console.log("✅ Lens loaded successfully.");

      // Apply Lens
      await session.applyLens(lens);
      console.log("🎭 Lens applied successfully.");
    } catch (lensError) {
      console.error("❌ Failed to load Lens. Possible reasons:");
      console.error("- The Lens ID does not exist.");
      console.error("- The Lens is not part of the specified Lens Group.");
      console.error("- Your API key does not have permission to access this Lens.");
      console.error("Error Details:", lensError);
    }

  } catch (error) {
    console.error("❌ An error occurred:", error);
  }
})();
