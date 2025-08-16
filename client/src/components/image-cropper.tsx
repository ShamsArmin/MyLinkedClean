import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface ImageCropperProps {
  open: boolean;
  onClose: () => void;
  image: string;
  onCropDone: (croppedImageUrl: string) => void;
  aspectRatio?: number;
}

const ImageCropper = ({ open, onClose, image, onCropDone, aspectRatio = 1 }: ImageCropperProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (location: { x: number, y: number }) => {
    setCrop(location);
  };

  const onZoomChange = (value: number[]) => {
    setZoom(value[0] || 1);
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixelsData: any) => {
    setCroppedAreaPixels(croppedAreaPixelsData);
  }, []);

  const createCroppedImage = async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        if (croppedImage) {
          onCropDone(croppedImage);
          onClose();
        }
      }
    } catch (e) {
      console.error('Error creating cropped image:', e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-64 my-4">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onCropComplete={onCropComplete}
            onZoomChange={(value) => setZoom(value)}
          />
        </div>
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Zoom:</span>
            <div className="flex-1">
              <Slider 
                value={[zoom]} 
                min={1} 
                max={3} 
                step={0.1} 
                onValueChange={onZoomChange} 
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={createCroppedImage}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to create a cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // To avoid CORS issues
    image.src = url;
  });

const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string | null> => {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return null;
    }

    // Set canvas size to the cropped size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw the cropped image onto the canvas
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // Return the data URL for the cropped image
    return canvas.toDataURL('image/jpeg', 0.9);
  } catch (e) {
    console.error('Error cropping image:', e);
    return null;
  }
};

export default ImageCropper;