import React, { useState } from 'react';
import { Plus, Trash2, AlertCircle, Info } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Badge from '../../ui/Badge';
import Card, { CardHeader } from '../../ui/Card';
import { AttributeGroupUI } from '../../../types/ui';

interface AttributeManagerProps {
  attributes: AttributeGroupUI[];
  variantsCount: number;
  activeAttributeNames: string[]; // Names of attributes currently reflected in generated variants
  onAddAttribute: (name: string) => void;
  onRemoveAttribute: (name: string) => void;
  onAddValue: (groupName: string, value: string) => void;
  onRemoveValue: (groupName: string, value: string) => void;
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
  const [newGroupName, setNewGroupName] = useState('');
  const [groupError, setGroupError] = useState('');
  const [newValueInputs, setNewValueInputs] = useState<Record<string, string>>({});

  const handleAddGroup = () => {
    const trimmedName = newGroupName.trim();
    if (!trimmedName) return;

    if (attributes.some(attr => attr.name.toLowerCase() === trimmedName.toLowerCase())) {
      setGroupError('An attribute group with this name already exists.');
      return;
    }

    onAddAttribute(trimmedName);
    setNewGroupName('');
    setGroupError('');
  };

  const handleAddValue = (groupName: string) => {
    const val = newValueInputs[groupName]?.trim();
    if (!val) return;
    
    onAddValue(groupName, val);
    setNewValueInputs(prev => ({ ...prev, [groupName]: '' }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader 
          title="Product Attributes" 
          subtitle="Define attributes like Size, Color, or Material to generate variants."
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
          <Input
            label="New Attribute Group"
            placeholder="e.g. Size, Color"
            value={newGroupName}
            onChange={(e) => {
              setNewGroupName(e.target.value);
              if (groupError) setGroupError('');
            }}
            error={groupError}
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleAddGroup()}
          />
          <Button 
            onClick={handleAddGroup} 
            icon={Plus}
            disabled={!newGroupName.trim()}
          >
            Add Group
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attributes.map((group) => (
            <AttributeGroupCard
              key={group.id}
              group={group}
              isActive={activeAttributeNames.includes(group.name.toLowerCase())}
              onRemove={() => onRemoveAttribute(group.name)}
              onAddValue={onAddValue}
              onRemoveValue={onRemoveValue}
            />
          ))}
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
  isActive: boolean;
  onRemove: () => void;
  onAddValue: (name: string, val: string) => void;
  onRemoveValue: (name: string, val: string) => void;
}

function AttributeGroupCard({ group, isActive, onRemove, onAddValue, onRemoveValue }: GroupCardProps) {
  const [newValue, setNewValue] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleAddValue = () => {
    if (!newValue.trim()) return;
    onAddValue(group.name, newValue.trim());
    setNewValue('');
  };

  return (
    <div className="p-4 rounded-xl border border-[#edf4ff] bg-[#f7f9ff] flex flex-col gap-4 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[#213447]">{group.name}</h4>
        
        {!isConfirmingDelete ? (
          <button 
            onClick={() => isActive ? setIsConfirmingDelete(true) : onRemove()}
            className="text-[#a0b4cb] hover:text-[#a83836] p-1 transition-colors"
            aria-label={`Delete ${group.name} group`}
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
        {group.values.map((val) => (
          <Badge 
            key={val} 
            variant="purple" 
            onRemove={() => onRemoveValue(group.name, val)}
            ariaLabel={`Remove ${val} from ${group.name}`}
          >
            {val}
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Add value..."
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="flex-1"
          size={undefined} // Input atom doesn't have size but is styled via className
          onKeyDown={(e) => e.key === 'Enter' && handleAddValue()}
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddValue}
          disabled={!newValue.trim()}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
