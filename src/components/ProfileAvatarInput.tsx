import {
  useState,
  useRef,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useEffect,
} from "react";
import ProfileAvatarUploadModal from "./ProfileAvatarUploadModal";
import "../common/styles/AvatarUpload.css";
import { Box, IconButton } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { config } from "../config";

interface Props {
  profileImage?: File;
  changeProfileImage: Dispatch<SetStateAction<File | undefined>>;
  width: number;
  height: number;
}

function ProfileAvatarInput({
  profileImage,
  changeProfileImage,
  width,
  height,
}: Props) {
  const [preview, setPreview] = useState(profileImage);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileModalImage, setProfileModalImage] = useState<File>();

  useEffect(() => {
    setPreview(profileImage);
    setProfileModalImage(profileImage);
  }, [profileImage]);

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const onSaveCroppedImage = (blob: Blob) => {
    // Normalize avatar edits into the same filename/type so `createFormData`
    // can treat cropped images just like freshly uploaded ones.
    changeProfileImage(new File([blob], "profile.png", { type: "image/png" }));
    setPreview(new File([blob], "profile.png", { type: "image/png" }));
    setProfileModalOpen(false);
  };

  const openFileInput = () => {
    hiddenFileInput?.current?.click();
  };

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileModalImage(e.target?.files[0]);
      setProfileModalOpen(true);
    }
  };

  const resetProfileImage = () => {
    setPreview(undefined);
    changeProfileImage(undefined);
  };

  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        width: width,
        height: height,
      }}
    >
      {preview && (
        <IconButton
          sx={{ position: "absolute", top: 0, left: 0 }}
          onClick={resetProfileImage}
        >
          <CancelOutlinedIcon />
        </IconButton>
      )}
      <Box className="avatar-upload-container" sx={{ mx: "auto" }}>
        {profileModalImage && (
          <ProfileAvatarUploadModal
            profileModalOpen={profileModalOpen}
            profileImage={profileModalImage}
            onSaveCroppedImage={onSaveCroppedImage}
            setProfileModalOpen={setProfileModalOpen}
          />
        )}
        {/* Hide the actual file input so we can style the dropzone freely. */}
        <input
          type="file"
          accept="image/*"
          ref={hiddenFileInput}
          onChange={onSelectFile}
        />
        <Box className="img-container">
          <img
            src={
              preview
                ? URL.createObjectURL(preview)
                : config.publicFolderUrl + "add-user.jpeg"
            }
            alt="Preview"
            width={width}
            height={height}
            onClick={openFileInput}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default ProfileAvatarInput;
