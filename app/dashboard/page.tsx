import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import FilterTable from '../components/FilterTable';
import ImageProcessingButton from '../components/ImageProcessingButton';
import { DataRow } from '../components/FilterTable';

async function getData(): Promise<DataRow[]> {
  const results: DataRow[] = [];
  const filePath = path.join(process.cwd(), 'data', 'csv-registration.csv');

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: any) => {
        if (data.ID && data.Nombre && data.Email && data['Fecha de Registro']) {
          results.push({
            ID: data.ID,
            Nombre: data.Nombre,
            Email: data.Email,
            FechaDeRegistro: data['Fecha de Registro'],
          });
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

export default async function Dashboard() {
  try {
    const data = await getData();
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Dashboard</h1>
        <ImageProcessingButton />
        <div>
          <h2>Datos del CSV</h2>
          <FilterTable data={data} />
        </div>
      </div>
    );
  } catch (error) {
    return <div>Error loading data</div>;
  }
}
