import { bootstrapCameraKit } from '@snap/camera-kit';

(async function () {
  try {
    console.log("🚀 Initializing Camera Kit...");
    
    const apiToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQxMzI5MjgzLCJzdWIiOiJmN2RlYzZmYS03YmY5LTQxY2EtODhhNi1mNjI1ZjQzNGNjMGN-U1RBR0lOR35mOTJmMmViOC05OGE4LTQzNDEtODAxMS1kYTMzNTlhZjRkNjcifQ.6iReOi6yW-QLdiYvAZQHTg8SXOrUX3Uo--h0bK4PaZM';
    
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
    const lensId = '2566fb54-d7a0-4403-a07d-8c27d9c91286';
    const lensGroupId = 'b4a54e5d-8d05-4f3e-974c-c76e3b91fe5f';

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
