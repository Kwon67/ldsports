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
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadingVideo, setUploadingVideo] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }
    fetchProducts();
  }, [isAuthenticated, router]);

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

      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              background: '#222',
              border: '1px solid #333',
              color: '#fff',
              padding: '12px 16px',
              borderRadius: 8,
              fontSize: 16,
            }}
          />
          <button
            onClick={openCreate}
            style={{
              background: '#facc15',
              color: '#000',
              padding: '12px 20px',
              borderRadius: 8,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            + Novo
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
