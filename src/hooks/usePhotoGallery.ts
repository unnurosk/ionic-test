import { useState, useEffect } from "react";
import { useCamera } from '@ionic/react-hooks/camera';
import { useFilesystem, base64FromPath } from '@ionic/react-hooks/filesystem';
import { useStorage } from '@ionic/react-hooks/storage';
import { isPlatform } from '@ionic/react';
import { CameraResultType, CameraSource, CameraPhoto, Capacitor, FilesystemDirectory } from "@capacitor/core";

const PHOTO_STORAGE = "photos";


export class PhotoService {
  public photos: Photo[] = [];

  // other code
}
const {  set } = useStorage();
export function usePhotoGallery() {

    const { getPhoto } = useCamera();
    const [photos, setPhotos] = useState<Photo[]>([]);
    const { deleteFile, getUri, readFile, writeFile } = useFilesystem();
    

    const savePicture = async (photo: CameraPhoto, fileName: string): Promise<Photo> => {
        const base64Data = await base64FromPath(photo.webPath!);
        console.log('directory',FilesystemDirectory.Data)
        const savedFile = await writeFile({
          path: fileName,
          data: base64Data,
          directory: FilesystemDirectory.Data
        });
      
        // Use webPath to display the new image instead of base64 since it's
        // already loaded into memory
        return {
          filepath: fileName,
          webviewPath: photo.webPath
        };
      };
  
      const takePhoto = async () => {
        const cameraPhoto = await getPhoto({
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
          quality: 100
        });
      
        const fileName = new Date().getTime() + '.jpeg';
        const savedFileImage = await savePicture(cameraPhoto, fileName);
        const newPhotos = [savedFileImage, ...photos];
        setPhotos(newPhotos);

        
      };
  
    return {
      photos,
        takePhoto
    };
    
  }

export interface Photo {
    filepath: string;
    webviewPath?: string;
    base64?: string;
}