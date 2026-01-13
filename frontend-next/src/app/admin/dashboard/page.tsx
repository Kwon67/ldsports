'use client';

import { useEffect, useState, useRef, ChangeEvent, FormEvent, CSSProperties } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/config/api';
import type { Product, MediaItem } from '@/types';

interface EditingProduct extends Partial<Product> {
  _id?: string;
  cloudinaryId?: string;
}

function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<'list' | 'edit' | 'settings'>('list');
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [uploadingHero, setUploadingHero] = useState<boolean>(false);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadingVideo, setUploadingVideo] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const fetchProducts = async (): Promise<void> => {
    try {
      const response = await axios.get(`${getApiUrl()}/products`);
      // Normalize products to have id field from _id
      const normalizedProducts = response.data.map((product: Product) => ({
        ...product,
        id: product._id || product.id,
      }));
      setProducts(normalizedProducts);
    } catch (_error) {
      console.error('Erro ao buscar produtos:', _error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async (): Promise<void> => {
    try {
      const response = await axios.get(`${getApiUrl()}/admin/settings`);
      const images = response.data.heroImages || (response.data.heroImage ? [response.data.heroImage] : []);
      setHeroImages(images);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    }
  };

  const handleHeroImageUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingHero(true);
    const newImages: string[] = [...heroImages];

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await axios.post(`${getApiUrl()}/admin/upload-hero`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        newImages.push(response.data.url);
      }
      setHeroImages(newImages);
      await axios.put(`${getApiUrl()}/admin/settings`, { heroImages: newImages });
      alert(`${files.length} imagem(ns) adicionada(s) com sucesso!`);
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao fazer upload da(s) imagem(ns)');
    } finally {
      setUploadingHero(false);
      if (heroImageInputRef.current) {
        heroImageInputRef.current.value = '';
      }
    }
  };

  const removeHeroImage = async (index: number): Promise<void> => {
    const newImages = heroImages.filter((_, i) => i !== index);
    setHeroImages(newImages);
    try {
      await axios.put(`${getApiUrl()}/admin/settings`, { heroImages: newImages });
      alert('Imagem removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      alert('Erro ao remover imagem');
    }
  };

  const saveSettings = async (): Promise<void> => {
    setSavingSettings(true);
    try {
      await axios.put(`${getApiUrl()}/admin/settings`, { heroImage });
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setSavingSettings(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }
    fetchProducts();
    fetchSettings();
  }, [isAuthenticated, router]);

  const handleDelete = async (id: string | number, name: string): Promise<void> => {
    if (window.confirm(`Excluir "${name}"?`)) {
      try {
        await axios.delete(`${getApiUrl()}/admin/products/${id}`);
        fetchProducts();
      } catch {
        alert('Erro ao excluir');
      }
    }
  };

  const openEdit = (product: Product): void => {
    // Migrate legacy image field to images array if needed
    const images =
      product.images ||
      (product.image
        ? [
            {
              url: product.image,
              publicId: (product as EditingProduct).cloudinaryId || '',
              type: 'image' as const,
            },
          ]
        : []);

    setEditingProduct({
      ...product,
      images,
    });
    setView('edit');
  };

  const openCreate = (): void => {
    setEditingProduct({
      name: '',
      team: '',
      price: 0,
      image: '',
      images: [],
      video: undefined,
      description: '',
      sizes: ['P', 'M', 'G', 'GG'],
      discountPercentage: undefined,
    });
    setView('edit');
  };

  const goBack = (): void => {
    setView('list');
    setEditingProduct(null);
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const currentImages = editingProduct?.images || [];
      const newImages: MediaItem[] = [...currentImages];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post(`${getApiUrl()}/admin/upload`, formData);
        newImages.push({
          url: response.data.url,
          publicId: response.data.publicId,
          type: 'image',
        });
      }

      setEditingProduct(prev =>
        prev
          ? {
              ...prev,
              images: newImages,
              image: newImages[0]?.url || '', // Keep legacy field in sync
            }
          : null
      );
    } catch {
      alert('Erro no upload de imagem');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleVideoUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await axios.post(`${getApiUrl()}/admin/upload-video`, formData);
      setEditingProduct(prev =>
        prev
          ? {
              ...prev,
              video: {
                url: response.data.url,
                publicId: response.data.publicId,
                type: 'video',
              },
            }
          : null
      );
    } catch {
      alert('Erro no upload do vídeo');
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  };

  const removeImage = async (index: number): Promise<void> => {
    if (!editingProduct?.images) return;

    const imageToRemove = editingProduct.images[index];

    try {
      if (imageToRemove.publicId) {
        await axios.delete(
          `${getApiUrl()}/admin/media/${encodeURIComponent(imageToRemove.publicId)}`
        );
      }
    } catch (err) {
      console.error('Error deleting from cloudinary:', err);
    }

    const newImages = editingProduct.images.filter((_, i) => i !== index);
    setEditingProduct(prev =>
      prev
        ? {
            ...prev,
            images: newImages,
            image: newImages[0]?.url || '',
          }
        : null
    );
  };

  const removeVideo = async (): Promise<void> => {
    if (!editingProduct?.video) return;

    try {
      if (editingProduct.video.publicId) {
        await axios.delete(
          `${getApiUrl()}/admin/media/${encodeURIComponent(editingProduct.video.publicId)}`
        );
      }
    } catch (err) {
      console.error('Error deleting video from cloudinary:', err);
    }

    setEditingProduct(prev =>
      prev
        ? {
            ...prev,
            video: undefined,
          }
        : null
    );
  };

  const moveImage = (index: number, direction: 'up' | 'down'): void => {
    if (!editingProduct?.images) return;

    const newImages = [...editingProduct.images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newImages.length) return;

    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];

    setEditingProduct(prev =>
      prev
        ? {
            ...prev,
            images: newImages,
            image: newImages[0]?.url || '',
          }
        : null
    );
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!editingProduct) return;

    setSaving(true);

    let sizes = editingProduct.sizes;
    if (typeof sizes === 'string') {
      sizes = (sizes as string)
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    }

    const payload = {
      ...editingProduct,
      sizes,
      price: parseFloat(String(editingProduct.price)) || 0,
      image: editingProduct.images?.[0]?.url || editingProduct.image || '',
    };

    try {
      if (editingProduct._id) {
        await axios.put(`${getApiUrl()}/admin/products/${editingProduct._id}`, payload);
      } else {
        await axios.post(`${getApiUrl()}/admin/products`, payload);
      }
      goBack();
      // Pequeno delay para garantir que o backend liberou o arquivo
      setTimeout(() => fetchProducts(), 500);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Erro ao salvar: ${error.response.data.details || error.response.data.error}`);
      } else {
        alert('Erro ao salvar');
      }
    } finally {
      setSaving(false);
    }
  };

  const doLogout = (): void => {
    logout();
    router.push('/admin/login');
  };

  const filtered = products.filter(
    p =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.team?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerStyle: CSSProperties = {
    minHeight: '100vh',
    background: '#111',
    color: '#fff',
    fontFamily: 'system-ui',
  };
  const headerStyle: CSSProperties = {
    background: '#000',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    borderBottom: '1px solid #333',
  };
  const inputStyle: CSSProperties = {
    width: '100%',
    padding: 14,
    background: '#222',
    border: '1px solid #444',
    borderRadius: 8,
    color: '#fff',
    fontSize: 16,
  };

  if (view === 'edit' && editingProduct) {
    return (
      <div style={containerStyle}>
        <header style={headerStyle}>
          <button
            onClick={goBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: 24,
              cursor: 'pointer',
            }}
          >
            ←
          </button>
          <span style={{ fontWeight: 700 }}>{editingProduct._id ? 'Editar' : 'Novo'} Produto</span>
        </header>

        <form onSubmit={handleSave} style={{ padding: 16, maxWidth: 600, margin: '0 auto' }}>
          {/* Images Gallery */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: 'block',
                color: '#888',
                marginBottom: 12,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              📷 Imagens do Produto ({editingProduct.images?.length || 0})
            </label>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 12,
                marginBottom: 12,
              }}
            >
              {editingProduct.images?.map((img, index) => (
                <div
                  key={img.publicId || index}
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    background: '#222',
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: index === 0 ? '2px solid #facc15' : '1px solid #333',
                  }}
                >
                  <img
                    src={img.url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {index === 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 4,
                        left: 4,
                        background: '#facc15',
                        color: '#000',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                    >
                      PRINCIPAL
                    </span>
                  )}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      display: 'flex',
                      gap: 2,
                      padding: 4,
                      background: 'rgba(0,0,0,0.7)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => moveImage(index, 'up')}
                      disabled={index === 0}
                      style={{
                        flex: 1,
                        padding: 6,
                        background: '#333',
                        border: 'none',
                        borderRadius: 4,
                        color: '#fff',
                        cursor: index === 0 ? 'not-allowed' : 'pointer',
                        opacity: index === 0 ? 0.3 : 1,
                        fontSize: 12,
                      }}
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        flex: 1,
                        padding: 6,
                        background: '#dc2626',
                        border: 'none',
                        borderRadius: 4,
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: 12,
                      }}
                    >
                      🗑️
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, 'down')}
                      disabled={index === (editingProduct.images?.length || 0) - 1}
                      style={{
                        flex: 1,
                        padding: 6,
                        background: '#333',
                        border: 'none',
                        borderRadius: 4,
                        color: '#fff',
                        cursor:
                          index === (editingProduct.images?.length || 0) - 1
                            ? 'not-allowed'
                            : 'pointer',
                        opacity: index === (editingProduct.images?.length || 0) - 1 ? 0.3 : 1,
                        fontSize: 12,
                      }}
                    >
                      ▶
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Image Button */}
              <label
                style={{
                  aspectRatio: '1',
                  background: '#1a1a1a',
                  borderRadius: 8,
                  border: '2px dashed #444',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
              >
                <span style={{ fontSize: 32, marginBottom: 4 }}>+</span>
                <span style={{ fontSize: 12, color: '#888' }}>Adicionar</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {uploading && <p style={{ color: '#facc15', fontSize: 14 }}>⏳ Enviando imagens...</p>}
          </div>

          {/* Video Section */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: 'block',
                color: '#888',
                marginBottom: 12,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              🎬 Vídeo (opcional)
            </label>

            {editingProduct.video ? (
              <div
                style={{
                  position: 'relative',
                  background: '#222',
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid #333',
                }}
              >
                <video
                  src={editingProduct.video.url}
                  controls
                  style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }}
                />
                <button
                  type="button"
                  onClick={removeVideo}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: '#dc2626',
                    border: 'none',
                    borderRadius: 6,
                    color: '#fff',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  🗑️ Remover Vídeo
                </button>
              </div>
            ) : (
              <label
                style={{
                  display: 'block',
                  padding: 24,
                  background: '#1a1a1a',
                  borderRadius: 8,
                  border: '2px dashed #444',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <span style={{ display: 'block', fontSize: 24, marginBottom: 8 }}>🎥</span>
                <span style={{ color: '#888', fontSize: 14 }}>
                  Clique para enviar vídeo (MP4, WebM - máx 100MB)
                </span>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={handleVideoUpload}
                  style={{ display: 'none' }}
                />
              </label>
            )}

            {uploadingVideo && (
              <p style={{ color: '#facc15', fontSize: 14, marginTop: 8 }}>⏳ Enviando vídeo...</p>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: '#888', marginBottom: 8, fontSize: 14 }}>
              Nome do Produto *
            </label>
            <input
              type="text"
              value={editingProduct.name || ''}
              onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
              required
              placeholder="Camisa Flamengo Home 24/25"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: '#888', marginBottom: 8, fontSize: 14 }}>
              Time *
            </label>
            <input
              type="text"
              value={editingProduct.team || ''}
              onChange={e => setEditingProduct({ ...editingProduct, team: e.target.value })}
              required
              placeholder="Flamengo"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: '#888', marginBottom: 8, fontSize: 14 }}>
              Preço (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              value={editingProduct.price || ''}
              onChange={e =>
                setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })
              }
              required
              placeholder="299.90"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: '#888', marginBottom: 8, fontSize: 14 }}>
              Desconto (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={editingProduct.discountPercentage || ''}
              onChange={e =>
                setEditingProduct({
                  ...editingProduct,
                  discountPercentage: parseFloat(e.target.value),
                })
              }
              placeholder="10"
              style={inputStyle}
            />
            <p style={{ marginTop: 4, fontSize: 12, color: '#666' }}>
              Se preenchido, o sistema calcula o preço promocional automaticamente.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: '#888', marginBottom: 8, fontSize: 14 }}>
              Descrição
            </label>
            <textarea
              value={editingProduct.description || ''}
              onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
              rows={4}
              placeholder="Descrição do produto..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: '#888', marginBottom: 8, fontSize: 14 }}>
              Tamanhos
            </label>
            <input
              type="text"
              value={
                Array.isArray(editingProduct.sizes)
                  ? editingProduct.sizes.join(', ')
                  : editingProduct.sizes || ''
              }
              onChange={e =>
                setEditingProduct({
                  ...editingProduct,
                  sizes: e.target.value.split(',').map(s => s.trim()),
                })
              }
              placeholder="P, M, G, GG"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={saving || uploading || uploadingVideo}
            style={{
              width: '100%',
              padding: 16,
              background: '#facc15',
              color: '#000',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              marginBottom: 12,
            }}
          >
            {saving ? 'Salvando...' : '✓ SALVAR PRODUTO'}
          </button>
          <button
            type="button"
            onClick={goBack}
            style={{
              width: '100%',
              padding: 14,
              background: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
        </form>
      </div>
    );
  }

  if (view === 'settings') {
    return (
      <div style={containerStyle}>
        <header style={headerStyle}>
          <span style={{ fontWeight: 800, fontSize: 18 }}>
            LD<span style={{ color: '#facc15' }}>SPORTS</span> - Configurações
          </span>
          <button
            onClick={() => setView('list')}
            style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
          >
            ← Voltar
          </button>
        </header>
        <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ marginBottom: 24, fontSize: 24 }}>Configurações do Site</h2>
          
          {/* Imagens do Hero */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 16, fontSize: 16, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>
              Imagens do Hero ({heroImages.length})
            </h3>
            <p style={{ marginBottom: 20, fontSize: 12, color: '#666' }}>
              As imagens mudam automaticamente a cada 5 segundos
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {heroImages.map((img, index) => (
                <div
                  key={index}
                  style={{
                    flex: '0 0 calc(33.333% - 12px)',
                    minWidth: 200,
                    padding: 16,
                    background: '#1a1a1a',
                    borderRadius: 12,
                    border: '1px solid #333',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h4 style={{ margin: 0, fontSize: 14, color: '#fff', fontWeight: 700 }}>
                      Imagem {index + 1}
                    </h4>
                    <button
                      onClick={() => removeHeroImage(index)}
                      style={{
                        background: '#dc2626',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        width: 28,
                        height: 28,
                        cursor: 'pointer',
                        fontSize: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <img
                    src={img}
                    alt={`Hero ${index + 1}`}
                    style={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      borderRadius: 8,
                      border: '1px solid #444',
                      marginBottom: 8,
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div style={{ fontSize: 10, color: '#666', wordBreak: 'break-all', maxHeight: 40, overflow: 'hidden' }}>
                    {img.substring(0, 50)}...
                  </div>
                </div>
              ))}
              
              {/* Container de Adicionar */}
              <div
                style={{
                  flex: '0 0 calc(33.333% - 12px)',
                  minWidth: 200,
                  padding: 16,
                  background: '#1a1a1a',
                  borderRadius: 12,
                  border: '2px dashed #444',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: uploadingHero ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => !uploadingHero && heroImageInputRef.current?.click()}
                onMouseEnter={(e) => {
                  if (!uploadingHero) {
                    e.currentTarget.style.borderColor = '#3c6eb4';
                    e.currentTarget.style.background = '#222';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!uploadingHero) {
                    e.currentTarget.style.borderColor = '#444';
                    e.currentTarget.style.background = '#1a1a1a';
                  }
                }}
              >
                <input
                  ref={heroImageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleHeroImageUpload}
                  style={{ display: 'none' }}
                />
                <div
                  style={{
                    fontSize: 48,
                    color: uploadingHero ? '#666' : '#3c6eb4',
                    marginBottom: 12,
                  }}
                >
                  {uploadingHero ? '⏳' : '+'}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: uploadingHero ? '#666' : '#888',
                    textAlign: 'center',
                    fontWeight: 600,
                  }}
                >
                  {uploadingHero ? 'Enviando...' : 'Adicionar Imagem'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#111',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Carregando...
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <header
        style={{
          background: '#000',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #333',
        }}
      >
        <span style={{ fontWeight: 800, fontSize: 18 }}>
          LD<span style={{ color: '#facc15' }}>SPORTS</span>
        </span>
        <button
          onClick={doLogout}
          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
        >
          Sair
        </button>
      </header>

      <div style={{ padding: '12px 8px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          <button
            onClick={() => setView('settings')}
            style={{
              background: '#333',
              color: '#fff',
              border: 'none',
              padding: '10px 12px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            ⚙️ Configurações
          </button>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              flex: '1 1 200px',
              minWidth: 0,
              maxWidth: '100%',
              background: '#222',
              border: '1px solid #333',
              color: '#fff',
              padding: '10px 12px',
              borderRadius: 8,
              fontSize: 14,
            }}
          />
          <button
            onClick={openCreate}
            style={{
              background: '#facc15',
              color: '#000',
              padding: '10px 16px',
              borderRadius: 8,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            + Novo Produto
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {filtered.map(product => {
            const mainImage = product.images?.[0]?.url || product.image;
            const imageCount = product.images?.length || (product.image ? 1 : 0);
            const hasVideo = !!product.video;

            return (
              <div
                key={product._id || product.id}
                style={{
                  background: '#1a1a1a',
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid #333',
                }}
              >
                <div
                  style={{
                    aspectRatio: '1',
                    background: '#222',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: 48, opacity: 0.3 }}>📷</span>
                  )}
                  <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
                    {imageCount > 1 && (
                      <span
                        style={{
                          background: 'rgba(0,0,0,0.7)',
                          color: '#fff',
                          fontSize: 10,
                          padding: '4px 8px',
                          borderRadius: 4,
                        }}
                      >
                        📷 {imageCount}
                      </span>
                    )}
                    {hasVideo && (
                      <span
                        style={{
                          background: 'rgba(0,0,0,0.7)',
                          color: '#fff',
                          fontSize: 10,
                          padding: '4px 8px',
                          borderRadius: 4,
                        }}
                      >
                        🎬
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ padding: 16 }}>
                  <small style={{ color: '#888', fontSize: 12, textTransform: 'uppercase' }}>
                    {product.team}
                  </small>
                  <p style={{ margin: '4px 0 8px', fontWeight: 700 }}>{product.name}</p>
                  <span style={{ color: '#facc15', fontWeight: 700, fontSize: 18 }}>
                    R$ {product.price?.toFixed(2)}
                  </span>
                  <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                    <button
                      onClick={() => openEdit(product)}
                      style={{
                        flex: 1,
                        background: '#333',
                        color: '#fff',
                        padding: 12,
                        borderRadius: 8,
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product._id || product.id, product.name)}
                      style={{
                        background: '#4a1515',
                        color: '#f87171',
                        padding: '12px 16px',
                        borderRadius: 8,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
