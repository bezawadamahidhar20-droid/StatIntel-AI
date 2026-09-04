import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../services/i18n';

export const DataUpload: React.FC = () => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    sizeKb: number;
    rowsCount: number;
    columns: string[];
    qualityScore: number;
    grade: string;
  } | null>(null);

  const simulateProcessing = (fileName: string, fileSize: number) => {
    setUploading(true);
    setProgress(15);
    setUploadedFile(null);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setUploading(false);
            setProgress(100);
            setUploadedFile({
              name: fileName,
              sizeKb: Math.round(fileSize / 1024),
              rowsCount: 2480,
              columns: ['District_Code', 'State_Name', 'CPI_Weight', 'IIP_Volume', 'Literacy_Pct', 'Outlier_Flag'],
              qualityScore: 94.2,
              grade: 'A+',
            });
          }, 400);
          return 95;
        }
        return prev + 20;
      });
    }, 200);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      simulateProcessing(file.name, file.size);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      simulateProcessing(file.name, file.size);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
            <UploadCloud className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t('uploadTitle')}
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Automatic schema inference, missing value imputation, and data quality scoring pipeline
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
          isDragging
            ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40 hover:border-blue-400 dark:hover:border-blue-500'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,.xlsx,.xls,.json"
          className="hidden"
        />

        <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
          <UploadCloud className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {t('dragDropText')}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Supports official MoSPI CSV, NSSO Unit-Level microdata, RBI DBIE Excel, and GeoJSON formats (Max 50MB)
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          {t('browseFiles')}
        </button>
      </div>

      {/* Progress Bar when uploading */}
      {uploading && (
        <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
              Running Quantile Normalization & Schema Detection...
            </span>
            <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Uploaded File Verification Card */}
      {uploadedFile && (
        <div className="p-5 bg-gradient-to-br from-emerald-50/70 to-teal-50/70 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-500/20">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {uploadedFile.name}
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold rounded-full">
                    {uploadedFile.sizeKb} KB
                  </span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {uploadedFile.rowsCount.toLocaleString('en-IN')} rows detected across {uploadedFile.columns.length} columns
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                {t('qualityScore')}
              </span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono block">
                {uploadedFile.qualityScore}% ({uploadedFile.grade})
              </span>
            </div>
          </div>

          {/* Inferred Schema Badges */}
          <div className="space-y-1.5 pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
              Inferred Schema Attributes:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {uploadedFile.columns.map((col, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-semibold rounded-lg shadow-2xs"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{t('readyForAnalysis')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataUpload;
