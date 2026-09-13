import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle, Info, RefreshCw } from 'lucide-react';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Card, { CardHeader } from '../../ui/Card';
import { AttributeGroupUI, AttributeValueUI } from '../../../types/ui';
import { fetchAttributes } from '../../../services/attributeService';
import { AttributeApi, AttributeOptionApi } from '../../../types/attribute';

interface AttributeManagerProps {
  attributes: AttributeGroupUI[];
  variantsCount: number;
  activeAttributeNames: string[];
  onAddAttribute: (attributeId: number, name: string, displayName: string) => void;
  onRemoveAttribute: (attributeId: number) => void;
  onAddValue: (attributeId: number, optionId: number, value: string, displayValue: string) => void;
  onRemoveValue: (attributeId: number, optionId: number) => void;
  isStale?: boolean;
  onGenerate?: () => void;
}

export default function AttributeManager({
  attributes,
  variantsCount,
  activeAttributeNames,
  onAddAttribute,
  onRemoveAttribute,
  onAddValue,
  onRemoveValue,
  isStale = false,
  onGenerate,
}: AttributeManagerProps) {
  const [globalAttributes, setGlobalAttributes] = useState<AttributeApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttributeId, setSelectedAttributeId] = useState<string>('');

  useEffect(() => {
    loadGlobalAttributes();
  }, []);

  const loadGlobalAttributes = async () => {
    try {
      setLoading(true);
      const data = await fetchAttributes();
      setGlobalAttributes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGroup = () => {
    if (!selectedAttributeId) return;
    const attr = globalAttributes.find(a => a.id.toString() === selectedAttributeId);
    if (!attr) return;

    if (attributes.some(a => a.attributeId === attr.id)) {
      alert('Attribute already added');
      return;
    }

    onAddAttribute(attr.id, attr.name, attr.displayName);
    setSelectedAttributeId('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader 
          title="Product Attributes" 
          subtitle="Select global attributes (e.g., Size, Color) and assign options for variants."
          icon={Info}
        />
        
        {isStale && (
          <div className="mb-6 p-4 bg-[#fff1f0] border border-[#ffccc7] rounded-xl flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ffccc7] flex items-center justify-center text-[#cf1322]">
                <AlertCircle size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#cf1322]">Variants are out of sync</p>
                <p className="text-xs text-[#a8071a]">Attributes have changed since variants were last generated.</p>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="danger" 
              onClick={onGenerate}
              className="shadow-sm"
            >
              Re-generate Now
            </Button>
          </div>
        )}
        
        <div className="flex items-end gap-3 mb-8">
          <div className="flex-1 space-y-1">
            <label className="text-sm font-medium text-[#213447]">Select Attribute Group</label>
            <div className="flex items-center gap-2">
              <select
                className="flex-1 h-10 rounded-xl border border-[rgba(160,180,203,0.3)] bg-white px-3 py-2 text-sm text-[#213447] focus:border-[#0058cd] focus:ring-1 focus:ring-[#0058cd] transition-all outline-none"
                value={selectedAttributeId}
                onChange={e => setSelectedAttributeId(e.target.value)}
                disabled={loading}
              >
                <option value="">-- Choose an attribute --</option>
                {globalAttributes
                  .filter(a => !attributes.some(selected => selected.attributeId === a.id))
                  .map(a => (
                    <option key={a.id} value={a.id}>{a.displayName}</option>
                  ))
                }
              </select>
              <button 
                onClick={loadGlobalAttributes} 
                title="Refresh global attributes"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f8fbff] text-[#0058cd] hover:bg-[#edf4ff]"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
          
          <Button 
            onClick={handleAddGroup} 
            icon={Plus}
            disabled={!selectedAttributeId || loading}
          >
            Add Group
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attributes.map((group) => {
            const globalAttr = globalAttributes.find(a => a.id === group.attributeId);
            return (
              <AttributeGroupCard
                key={group.id}
                group={group}
                globalOptions={globalAttr?.options || []}
                isActive={activeAttributeNames.includes(group.name.toLowerCase())}
                onRemove={() => group.attributeId && onRemoveAttribute(group.attributeId)}
                onAddValue={(optionId, val, dval) => group.attributeId && onAddValue(group.attributeId, optionId, val, dval)}
                onRemoveValue={(optionId) => group.attributeId && onRemoveValue(group.attributeId, optionId)}
              />
            );
          })}
        </div>

        {attributes.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-[#edf4ff] rounded-2xl">
            <p className="text-sm text-[#697d92]">No attribute groups defined yet.</p>
          </div>
        )}
      </Card>
    </div>
  );
}

interface GroupCardProps {
  group: AttributeGroupUI;
  globalOptions: AttributeOptionApi[];
  isActive: boolean;
  onRemove: () => void;
  onAddValue: (optionId: number, value: string, displayValue: string) => void;
  onRemoveValue: (optionId: number) => void;
}

function AttributeGroupCard({ group, globalOptions, isActive, onRemove, onAddValue, onRemoveValue }: GroupCardProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleAddValue = () => {
    if (!selectedOptionId) return;
    const option = globalOptions.find(o => o.id.toString() === selectedOptionId);
    if (!option) return;

    onAddValue(option.id, option.value, option.displayValue);
    setSelectedOptionId('');
  };

  return (
    <div className="p-4 rounded-xl border border-[#edf4ff] bg-[#f7f9ff] flex flex-col gap-4 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[#213447]">{group.displayName}</h4>
        
        {!isConfirmingDelete ? (
          <button 
            onClick={() => isActive ? setIsConfirmingDelete(true) : onRemove()}
            className="text-[#a0b4cb] hover:text-[#a83836] p-1 transition-colors"
            aria-label={`Delete ${group.displayName} group`}
          >
            <Trash2 size={16} />
          </button>
        ) : (
          <div className="flex items-center gap-2 animate-scale-in">
            <span className="text-[10px] font-bold text-[#a83836] uppercase tracking-wider">Are you sure?</span>
            <Button size="sm" variant="danger" onClick={onRemove}>Yes</Button>
            <Button size="sm" variant="ghost" onClick={() => setIsConfirmingDelete(false)}>No</Button>
          </div>
        )}
      </div>

      {isConfirmingDelete && isActive && (
        <div className="bg-[#fff7f6] p-2 rounded-lg border border-[#a83836]/20 flex items-center gap-2 animate-fade-slide-up">
          <AlertCircle size={14} className="text-[#a83836] shrink-0" />
          <p className="text-[10px] text-[#a83836] leading-tight">
            Deleting this group will remove associated variants.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {group.values.map((val: AttributeValueUI) => (
          <Badge 
            key={val.optionId} 
            variant="purple" 
            onRemove={() => onRemoveValue(val.optionId)}
            ariaLabel={`Remove ${val.displayValue} from ${group.displayName}`}
          >
            {val.displayValue}
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <select
          className="flex-1 h-9 rounded-md border border-[rgba(160,180,203,0.3)] bg-white px-3 py-1 text-sm text-[#213447] focus:border-[#0058cd] focus:ring-1 focus:ring-[#0058cd] outline-none"
          value={selectedOptionId}
          onChange={e => setSelectedOptionId(e.target.value)}
        >
          <option value="">Select option...</option>
          {globalOptions
            .filter(o => !group.values.some((v: AttributeValueUI) => v.optionId === o.id))
            .map(o => (
              <option key={o.id} value={o.id}>{o.displayValue}</option>
            ))
          }
        </select>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddValue}
          disabled={!selectedOptionId}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
