import { MapPin, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Ong {
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  region: string;
  categoryColor: string;
  hours: string;
}

interface MapViewProps {
  ongs: Ong[];
  onSelectOng?: (ong: Ong) => void; // Nova prop para abrir detalhes
}

// Mapeamento de cores por categoria
const getCategoryMapColor = (category: string): string => {
  const colorMap: { [key: string]: string } = {
    "Assistência Social": "#3b82f6", // blue
    "Saúde": "#ef4444", // red
    "Meio Ambiente": "#10b981", // green
    "Educação": "#f97316", // orange
    "Animais": "#a855f7", // purple
    "Cultura": "#ec4899", // pink
    "Esportes": "#eab308", // yellow
    "Alimentação": "#f97316", // orange
    "Idosos": "#6366f1", // indigo
  };
  return colorMap[category] || "#14b8a6"; // teal default
};

// Coordenadas aproximadas das regiões de BH
const getRegionCoordinates = (region: string): [number, number] => {
  const regionMap: { [key: string]: [number, number] } = {
    "Centro-Sul": [-19.9245, -43.9352],
    "Pampulha": [-19.8510, -43.9677],
    "Barreiro": [-19.9912, -44.0308],
    "Venda Nova": [-19.8147, -43.9677],
    "Norte": [-19.8733, -43.9502],
    "Nordeste": [-19.8408, -43.8908],
    "Noroeste": [-19.9087, -44.0153],
    "Oeste": [-19.9378, -44.0513],
    "Leste": [-19.9156, -43.8625]
  };
  return regionMap[region] || [-19.9167, -43.9345]; // Centro de BH
};

// Gerar pequena variação nas coordenadas para distribuir ONGs na mesma região
const addRandomOffset = (coord: [number, number], index: number): [number, number] => {
  const offset = 0.01; // ~1km
  const angle = (index * 137.5) % 360; // Distribuição em espiral
  const radius = ((index % 5) * offset) / 5;
  
  const latOffset = Math.cos(angle * Math.PI / 180) * radius;
  const lngOffset = Math.sin(angle * Math.PI / 180) * radius;
  
  return [coord[0] + latOffset, coord[1] + lngOffset];
};

export function MapView({ ongs, onSelectOng }: MapViewProps) {
  const [selectedOng, setSelectedOng] = useState<Ong | null>(null);
  const [hoveredOng, setHoveredOng] = useState<Ong | null>(null);
  const [map, setMap] = useState<any>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Carregar Leaflet dinamicamente
    const loadLeaflet = async () => {
      const leaflet = await import('leaflet');
      setL(leaflet.default);
    };
    loadLeaflet();
  }, []);

  useEffect(() => {
    if (!L) return;

    // Criar o mapa
    const mapInstance = L.map('map', {
      center: [-19.9167, -43.9345], // Centro de BH
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Adicionar camada do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstance);

    // Agrupar ONGs por região para distribuição
    const ongsByRegion: { [key: string]: Ong[] } = {};
    ongs.forEach(ong => {
      if (!ongsByRegion[ong.region]) {
        ongsByRegion[ong.region] = [];
      }
      ongsByRegion[ong.region].push(ong);
    });

    // Adicionar marcadores para cada ONG
    Object.entries(ongsByRegion).forEach(([region, regionOngs]) => {
      const baseCoord = getRegionCoordinates(region);
      
      regionOngs.forEach((ong, index) => {
        const coord = addRandomOffset(baseCoord, index);
        const color = getCategoryMapColor(ong.category);

        // Criar ícone customizado
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              position: relative;
              width: 32px;
              height: 32px;
              cursor: pointer;
            ">
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 24px;
                height: 24px;
                background-color: ${color};
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                transition: all 0.2s ease;
              " class="marker-dot"></div>
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 8px;
                height: 8px;
                background-color: rgba(255,255,255,0.8);
                border-radius: 50%;
                pointer-events: none;
              "></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker(coord, { icon })
          .addTo(mapInstance)
          .on('click', () => {
            setSelectedOng(ong);
            mapInstance.setView(coord, 14, { animate: true });
            if (onSelectOng) {
              onSelectOng(ong);
            }
          })
          .on('mouseover', (e: any) => {
            setHoveredOng(ong);
            const markerDot = e.target.getElement()?.querySelector('.marker-dot');
            if (markerDot) {
              markerDot.style.width = '32px';
              markerDot.style.height = '32px';
              markerDot.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
            }
          })
          .on('mouseout', (e: any) => {
            if (hoveredOng?.id === ong.id && selectedOng?.id !== ong.id) {
              setHoveredOng(null);
            }
            const markerDot = e.target.getElement()?.querySelector('.marker-dot');
            if (markerDot && selectedOng?.id !== ong.id) {
              markerDot.style.width = '24px';
              markerDot.style.height = '24px';
              markerDot.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
            }
          });

        // Adicionar popup
        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #111827;">
              ${ong.name}
            </h3>
            <div style="
              display: inline-block;
              padding: 4px 12px;
              background-color: ${color};
              color: white;
              border-radius: 12px;
              font-size: 11px;
              margin-bottom: 8px;
            ">
              ${ong.category}
            </div>
            <p style="margin: 8px 0; font-size: 12px; color: #6b7280; line-height: 1.4;">
              ${ong.description.substring(0, 100)}${ong.description.length > 100 ? '...' : ''}
            </p>
            <div style="margin-top: 8px; font-size: 11px; color: #9ca3af;">
              📍 ${ong.location}<br>
              🕐 ${ong.hours}
            </div>
          </div>
        `, {
          maxWidth: 300,
          className: 'custom-popup'
        });
      });
    });

    setMap(mapInstance);

    // Cleanup
    return () => {
      mapInstance.remove();
    };
  }, [L, ongs]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
      {/* CSS para Leaflet */}
      <style>{`
        @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
        
        #map {
          width: 100%;
          height: 700px;
          z-index: 1;
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
        
        .leaflet-popup-content {
          margin: 16px;
        }
        
        .custom-marker {
          background: transparent;
          border: none;
        }
        
        .leaflet-container {
          font-family: system-ui, -apple-system, sans-serif;
        }
      `}</style>

      {/* Mapa */}
      <div id="map" className="relative">
        {!L && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando mapa de Belo Horizonte...</p>
            </div>
          </div>
        )}
        
        {/* Legenda de categorias MOVIDA PARA CIMA DO MAPA */}
        <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-5 border border-gray-200 max-w-md z-[1000]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full"></div>
            <h4 className="text-gray-900">Categorias</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: getCategoryMapColor("Assistência Social") }}></div>
              <span className="text-xs text-gray-700">Assistência</span>
            </div>
            <div className="flex items-center gap-2.5 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: getCategoryMapColor("Saúde") }}></div>
              <span className="text-xs text-gray-700">Saúde</span>
            </div>
            <div className="flex items-center gap-2.5 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: getCategoryMapColor("Meio Ambiente") }}></div>
              <span className="text-xs text-gray-700">Meio Ambiente</span>
            </div>
            <div className="flex items-center gap-2.5 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: getCategoryMapColor("Educação") }}></div>
              <span className="text-xs text-gray-700">Educação</span>
            </div>
            <div className="flex items-center gap-2.5 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: getCategoryMapColor("Animais") }}></div>
              <span className="text-xs text-gray-700">Animais</span>
            </div>
            <div className="flex items-center gap-2.5 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: getCategoryMapColor("Cultura") }}></div>
              <span className="text-xs text-gray-700">Cultura</span>
            </div>
            <div className="flex items-center gap-2.5 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: getCategoryMapColor("Esportes") }}></div>
              <span className="text-xs text-gray-700">Esportes</span>
            </div>
            <div className="flex items-center gap-2.5 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: getCategoryMapColor("Idosos") }}></div>
              <span className="text-xs text-gray-700">Idosos</span>
            </div>
          </div>
          
          <div className="flex items-center pt-3 mt-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600">{ongs.length} {ongs.length === 1 ? 'organização' : 'organizações'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card de informações da ONG selecionada */}
      {selectedOng && !onSelectOng && (
        <div className="absolute top-6 right-6 bg-white rounded-xl shadow-2xl p-6 border-2 border-teal-100 max-w-sm z-[1000] animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-gray-900 pr-2 leading-tight">{selectedOng.name}</h3>
            <button
              onClick={() => setSelectedOng(null)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div 
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-white text-sm mb-4 shadow-md`}
            style={{ backgroundColor: getCategoryMapColor(selectedOng.category) }}
          >
            {selectedOng.category}
          </div>
          
          <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
            {selectedOng.description}
          </p>
          
          <div className="space-y-3 text-sm bg-gray-50 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{selectedOng.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700">{selectedOng.hours}</span>
            </div>
          </div>
          
          <button
            onClick={() => {
              if (map) {
                const coord = getRegionCoordinates(selectedOng.region);
                map.setView(coord, 15, { animate: true });
              }
            }}
            className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg transition-colors text-sm"
          >
            Centralizar no Mapa
          </button>
        </div>
      )}
      
      {/* Lista de ONGs no mapa com design melhorado */}
      <div className="p-6 border-t border-gray-200 max-h-72 overflow-y-auto bg-gradient-to-b from-white to-gray-50">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full"></div>
          <h4 className="text-gray-900">ONGs no Mapa</h4>
        </div>
        <div className="space-y-2">
          {ongs.map((ong) => (
            <div 
              key={ong.id} 
              className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                selectedOng?.id === ong.id 
                  ? 'bg-teal-50 border-teal-300 shadow-md scale-[1.02]' 
                  : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200 hover:shadow-sm'
              }`}
              onClick={() => {
                setSelectedOng(ong);
                if (map) {
                  const coord = getRegionCoordinates(ong.region);
                  map.setView(coord, 14, { animate: true });
                }
                if (onSelectOng) {
                  onSelectOng(ong);
                }
              }}
              onMouseEnter={() => setHoveredOng(ong)}
              onMouseLeave={() => setHoveredOng(null)}
            >
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm" 
                style={{ backgroundColor: getCategoryMapColor(ong.category) }}
              ></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-900 truncate">{ong.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {ong.location}
                </div>
              </div>
              <div 
                className="text-xs px-3 py-1.5 rounded-full text-white shadow-sm"
                style={{ backgroundColor: getCategoryMapColor(ong.category) }}
              >
                {ong.category}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}