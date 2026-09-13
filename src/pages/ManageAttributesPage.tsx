import React, { useState, useEffect } from 'react';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { fetchAttributes, createAttribute, updateAttribute, deactivateAttribute, addAttributeOption, updateAttributeOption, deactivateAttributeOption } from '../services/attributeService';
import { AttributeApi, AttributeOptionApi } from '../types/attribute';

export const ManageAttributesPage: React.FC = () => {
  const [attributes, setAttributes] = useState<AttributeApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrDisplayName, setNewAttrDisplayName] = useState('');

  useEffect(() => {
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    try {
      const data = await fetchAttributes();
      setAttributes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAttribute = async () => {
    if (!newAttrName || !newAttrDisplayName) return;
    try {
      await createAttribute({ name: newAttrName, displayName: newAttrDisplayName, type: 'SELECT' });
      setNewAttrName('');
      setNewAttrDisplayName('');
      loadAttributes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeactivateAttribute = async (id: number) => {
    if (!window.confirm('Are you sure you want to deactivate this attribute?')) return;
    try {
      await deactivateAttribute(id);
      loadAttributes();
    } catch (err) {
      alert('Failed to deactivate attribute. It may be in use.');
    }
  };

  if (loading) return <div>Loading attributes...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#213447]">Manage Attributes</h1>
        <p className="text-sm text-[#4e6175] mt-1">
          Create and manage global product attributes (e.g., Color, Size) and their options.
        </p>
      </div>

      <Card>
        <CardHeader title="Add New Attribute" />
        <div className="flex gap-4 items-end mt-4">
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">Internal Name</label>
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="e.g. color"
              value={newAttrName}
              onChange={e => setNewAttrName(e.target.value)}
            />
          </div>
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">Display Name</label>
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="e.g. Color"
              value={newAttrDisplayName}
              onChange={e => setNewAttrDisplayName(e.target.value)}
            />
          </div>
          <Button onClick={handleCreateAttribute} icon={Plus}>
            Add Attribute
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {attributes.map(attr => (
          <AttributeCard key={attr.id} attribute={attr} onUpdate={loadAttributes} onDeactivate={handleDeactivateAttribute} />
        ))}
      </div>
    </div>
  );
};

const AttributeCard: React.FC<{ attribute: AttributeApi, onUpdate: () => void, onDeactivate: (id: number) => void }> = ({ attribute, onUpdate, onDeactivate }) => {
  const [newOptionValue, setNewOptionValue] = useState('');
  const [newOptionDisplayValue, setNewOptionDisplayValue] = useState('');

  const handleAddOption = async () => {
    if (!newOptionValue || !newOptionDisplayValue) return;
    try {
      await addAttributeOption(attribute.id, {
        value: newOptionValue,
        displayValue: newOptionDisplayValue,
        sortOrder: attribute.options.length,
      });
      setNewOptionValue('');
      setNewOptionDisplayValue('');
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeactivateOption = async (optionId: number) => {
    if (!window.confirm('Are you sure you want to deactivate this option?')) return;
    try {
      await deactivateAttributeOption(attribute.id, optionId);
      onUpdate();
    } catch (err) {
      alert('Failed to deactivate option. It may be in use.');
    }
  };

  return (
    <Card>
      <CardHeader 
        title={attribute.displayName} 
        action={
          <button 
            className="text-destructive p-2 hover:bg-red-50 rounded" 
            onClick={() => onDeactivate(attribute.id)}
          >
            <Trash2 size={16} />
          </button>
        } 
      />
      
      <p className="text-xs text-muted-foreground mb-4">Internal: {attribute.name}</p>
      
      <div className="space-y-2 mb-4">
        {attribute.options?.map(opt => (
          <div key={opt.id} className="flex items-center justify-between p-2 border rounded-md">
            <div>
              <span className="font-medium">{opt.displayValue}</span>
              <span className="text-xs text-muted-foreground ml-2">({opt.value})</span>
            </div>
            <button 
              className="text-destructive p-1 hover:bg-red-50 rounded" 
              onClick={() => handleDeactivateOption(opt.id)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {(!attribute.options || attribute.options.length === 0) && (
          <div className="text-sm text-muted-foreground">No options added yet.</div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
          placeholder="Value (e.g. red)"
          value={newOptionValue}
          onChange={e => setNewOptionValue(e.target.value)}
        />
        <input
          type="text"
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
          placeholder="Display (e.g. Red)"
          value={newOptionDisplayValue}
          onChange={e => setNewOptionDisplayValue(e.target.value)}
        />
        <Button size="sm" onClick={handleAddOption}>Add</Button>
      </div>
    </Card>
  );
};

