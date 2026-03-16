'use client';

import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp']
};

export default function UploadDropzone({ onFileSelect, disabled = false }: UploadDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted: (files) => {
      if (files.length > 0) onFileSelect(files[0]);
    },
    maxFiles: 1,
    disabled,
    maxSize: 10 * 1024 * 1024,
    accept: ACCEPTED_TYPES
  });

  return (
    <motion.div
      {...getRootProps()}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      className={`glass-card relative flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition ${
        isDragActive ? 'border-accent bg-accent/10' : 'border-white/20 hover:border-accent/60'
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      <input {...getInputProps()} />
      <Upload className="mb-3 h-10 w-10 text-accent" />
      <p className="text-lg font-medium">Drag &amp; drop an image here</p>
      <p className="mt-2 text-sm text-slate-400">or click to browse · JPG, JPEG, PNG, WEBP · Max 10MB</p>
    </motion.div>
  );
}
