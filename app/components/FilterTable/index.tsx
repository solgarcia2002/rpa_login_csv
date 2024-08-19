"use client";

import { useState } from 'react';
export interface DataRow {
    ID: string;
    Nombre: string;
    Email: string;
    FechaDeRegistro: string;
  }
  

interface FilterTableProps {
  data: DataRow[];
}

export default function FilterTable({ data }: FilterTableProps) {
    const [filter, setFilter] = useState('');
  
    const filteredData = data.filter(row =>
      row.ID.includes(filter) ||
      row.Nombre.includes(filter) ||
      row.Email.includes(filter) ||
      row.FechaDeRegistro.includes(filter)
    );
  
    console.log('Filtered data:', filteredData);
  
    return (
      <div>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtrar datos..."
        />
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Fecha de Registro</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr key={index}>
                  <td>{row.ID}</td>
                  <td>{row.Nombre}</td>
                  <td>{row.Email}</td>
                  <td>{row.FechaDeRegistro}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No hay datos para mostrar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
  