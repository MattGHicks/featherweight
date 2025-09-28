'use client';

import { useState } from 'react';

import { Download, Upload, X } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CSVImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

interface ImportItem {
  name: string;
  category: string;
  description: string;
  weight: number;
  quantity: number;
  isWorn: boolean;
  isConsumable: boolean;
}

export function CSVImportDialog({
  isOpen,
  onClose,
  onImportComplete,
}: CSVImportDialogProps) {
  const [importData, setImportData] = useState<ImportItem[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const downloadTemplate = () => {
    const headers = [
      'Item Name',
      'Category',
      'Description',
      'Weight (g)',
      'Quantity',
      'Is Worn (true/false)',
      'Is Consumable (true/false)',
    ];
    const sampleRows = [
      [
        'Tent',
        'Shelter',
        'Lightweight 2-person tent',
        '1200',
        '1',
        'false',
        'false',
      ],
      [
        'Hiking Boots',
        'Footwear',
        'Waterproof hiking boots',
        '800',
        '1',
        'true',
        'false',
      ],
      [
        'Energy Bar',
        'Food',
        'High-energy snack bar',
        '50',
        '5',
        'false',
        'true',
      ],
    ];

    const csvContent = [headers, ...sampleRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'gear_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSV = (csvText: string): string[][] => {
    const lines = csvText.split('\n');
    const result: string[][] = [];

    for (const line of lines) {
      if (line.trim() === '') continue;

      const row: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          row.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }

      row.push(current.trim());
      result.push(row.map(cell => cell.replace(/^"|"$/g, '')));
    }

    return result;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 1000000) {
      setErrors(['File is too large (max 1MB)']);
      return;
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setErrors(['Please select a CSV file']);
      return;
    }

    setIsValidating(true);
    setErrors([]);

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const csvText = e.target?.result as string;
        const rows = parseCSV(csvText);

        if (rows.length < 2) {
          setErrors([
            'CSV file must contain at least a header row and one data row',
          ]);
          setIsValidating(false);
          return;
        }

        const validationErrors: string[] = [];
        const validItems: ImportItem[] = [];

        // Skip header row, process data rows
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length < 7) {
            validationErrors.push(`Row ${i + 1}: Missing required columns`);
            continue;
          }

          const weight = parseFloat(row[3]);
          const quantity = parseInt(row[4]);

          if (isNaN(weight) || weight <= 0) {
            validationErrors.push(`Row ${i + 1}: Invalid weight "${row[3]}"`);
            continue;
          }

          if (isNaN(quantity) || quantity <= 0) {
            validationErrors.push(`Row ${i + 1}: Invalid quantity "${row[4]}"`);
            continue;
          }

          validItems.push({
            name: row[0].trim(),
            category: row[1].trim(),
            description: row[2].trim(),
            weight,
            quantity,
            isWorn: row[5].toLowerCase() === 'true',
            isConsumable: row[6].toLowerCase() === 'true',
          });
        }

        if (validationErrors.length > 0) {
          setErrors(validationErrors);
        }

        setImportData(validItems);
      } catch (error) {
        setErrors(['Failed to parse CSV file']);
      } finally {
        setIsValidating(false);
      }
    };

    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (importData.length === 0) return;

    setIsImporting(true);
    setErrors([]);

    try {
      // Get existing categories to match against
      const categoriesResponse = await fetch('/api/categories');
      const categories = await categoriesResponse.json();
      const categoryMap = new Map(
        categories.map((cat: any) => [cat.name.toLowerCase(), cat.id])
      );

      const importPromises = importData.map(async item => {
        // Find or create category
        let categoryId = categoryMap.get(item.category.toLowerCase());

        if (!categoryId) {
          // Create new category
          const categoryResponse = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: item.category,
              color: '#6b7280', // Default gray color
            }),
          });

          if (categoryResponse.ok) {
            const newCategory = await categoryResponse.json();
            categoryId = newCategory.id;
            categoryMap.set(item.category.toLowerCase(), categoryId);
          } else {
            throw new Error(`Failed to create category: ${item.category}`);
          }
        }

        // Create gear item
        const gearResponse = await fetch('/api/gear', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: item.name,
            description: item.description,
            weight: item.weight,
            quantity: item.quantity,
            categoryId,
            isWorn: item.isWorn,
            isConsumable: item.isConsumable,
          }),
        });

        if (!gearResponse.ok) {
          throw new Error(`Failed to create gear item: ${item.name}`);
        }

        return gearResponse.json();
      });

      await Promise.all(importPromises);
      onImportComplete();
      handleClose();
    } catch (error) {
      console.error('Import error:', error);
      setErrors(['Failed to import some items. Please try again.']);
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setImportData([]);
    setErrors([]);
    setIsValidating(false);
    setIsImporting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Import Gear from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk import gear items into your library
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-auto">
          {/* Template Download */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Need a template?</h4>
              <p className="text-sm text-muted-foreground">
                Download our CSV template with sample data and formatting
              </p>
            </div>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <h4 className="font-medium">Upload CSV File</h4>
              <p className="text-sm text-muted-foreground">
                Select a CSV file with your gear data
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-muted-foreground
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/80"
              />
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <Alert>
              <X className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  {errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Import Preview */}
          {importData.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">
                Preview Import ({importData.length} items)
              </h4>
              <div className="max-h-80 overflow-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-left p-2">Weight</th>
                      <th className="text-left p-2">Qty</th>
                      <th className="text-left p-2">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importData.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2 font-medium">{item.name}</td>
                        <td className="p-2">{item.category}</td>
                        <td className="p-2">{item.weight}g</td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            {item.isWorn && (
                              <Badge variant="outline" className="text-xs">
                                Worn
                              </Badge>
                            )}
                            {item.isConsumable && (
                              <Badge variant="outline" className="text-xs">
                                Consumable
                              </Badge>
                            )}
                            {!item.isWorn && !item.isConsumable && (
                              <Badge variant="outline" className="text-xs">
                                Base
                              </Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={importData.length === 0 || isImporting || isValidating}
          >
            {isImporting ? 'Importing...' : `Import ${importData.length} Items`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
