import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Plus, MoreHorizontal, Eye, Pencil, Stethoscope,
  CalendarPlus, Pill, ChevronLeft, ChevronRight, Users, Download,
} from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '@/i18n/I18nContext';
import { mockPatients } from '@/data/mockPatients';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Patient } from '@/types';

const PAGE_SIZE = 10;

export default function Patients() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'lastVisit'>('name');
  const [page, setPage] = useState(0);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);

  const filtered = useMemo(() => {
    let result = patients.filter((p) => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      const matchesSearch = !search || fullName.includes(search.toLowerCase()) || p.patientId.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search);
      const matchesGender = genderFilter === 'all' || p.gender === genderFilter;
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesGender && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === 'name') return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      if (sortBy === 'age') return new Date(b.birthDate).getTime() - new Date(a.birthDate).getTime();
      if (sortBy === 'lastVisit') {
        const aDate = a.lastVisit ? new Date(a.lastVisit).getTime() : 0;
        const bDate = b.lastVisit ? new Date(b.lastVisit).getTime() : 0;
        return bDate - aDate;
      }
      return 0;
    });

    return result;
  }, [search, genderFilter, statusFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('patients')}</h1>
          <p className="text-muted-foreground">{filtered.length} {t('patients').toLowerCase()} · {t('patientList')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">{t('export')}</span>
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4" />
            {t('addPatient')}
          </Button>
        </div>
      </div>

      {/* Filters bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ms-3" />
            <Input
              placeholder={t('searchPatients')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="ps-9"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Gender filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-3.5 w-3.5" />
                  {genderFilter === 'all' ? t('gender') : genderFilter === 'male' ? t('male') : t('female')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('gender')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setGenderFilter('all'); setPage(0); }}>{t('all')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setGenderFilter('male'); setPage(0); }}>{t('male')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setGenderFilter('female'); setPage(0); }}>{t('female')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {statusFilter === 'all' ? t('status') : statusFilter === 'active' ? t('active') : t('inactive')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('status')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setStatusFilter('all'); setPage(0); }}>{t('all')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setStatusFilter('active'); setPage(0); }}>{t('active')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setStatusFilter('inactive'); setPage(0); }}>{t('inactive')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {t('sort')}: {sortBy === 'name' ? t('name') : sortBy === 'age' ? t('age') : t('lastVisit')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('sort')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy('name')}>{t('name')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('age')}>{t('age')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('lastVisit')}>{t('lastVisit')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {/* Desktop table */}
        <div className="hidden lg:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('patientId')}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('patient')}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('age')}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('gender')}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('phone')}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('lastVisit')}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('diagnosis')}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('status')}</th>
                <th className="px-4 py-3 text-end text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-b border-border/50 transition-colors hover:bg-muted/30 cursor-pointer"
                  onClick={() => navigate(`/patient/${patient.id}`)}
                >
                  <td className="px-4 py-3 text-sm font-medium text-muted-foreground">{patient.patientId}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{patient.firstName} {patient.lastName}</p>
                        <p className="text-xs text-muted-foreground">{patient.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{new Date().getFullYear() - new Date(patient.birthDate).getFullYear()}</td>
                  <td className="px-4 py-3 text-sm">{patient.gender === 'male' ? t('male') : t('female')}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{patient.phone}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{patient.lastVisit || '—'}</td>
                  <td className="px-4 py-3">
                    {patient.lastDiagnosis ? (
                      <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">{patient.lastDiagnosis}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={patient.status === 'active' ? 'confirmed' : 'cancelled'} />
                  </td>
                  <td className="px-4 py-3 text-end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/patient/${patient.id}`)}>
                          <Eye className="h-4 w-4 me-2" /> {t('view')}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="h-4 w-4 me-2" /> {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/consultation')}>
                          <Stethoscope className="h-4 w-4 me-2" /> {t('newConsultation')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/appointments')}>
                          <CalendarPlus className="h-4 w-4 me-2" /> {t('appointment')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/prescriptions')}>
                          <Pill className="h-4 w-4 me-2" /> {t('prescription')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden divide-y divide-border">
          {paginated.map((patient) => (
            <div
              key={patient.id}
              className="p-4 cursor-pointer active:bg-muted/30"
              onClick={() => navigate(`/patient/${patient.id}`)}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary shrink-0">
                  {patient.firstName[0]}{patient.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">{patient.firstName} {patient.lastName}</p>
                    <StatusBadge status={patient.status === 'active' ? 'confirmed' : 'cancelled'} />
                  </div>
                  <p className="text-xs text-muted-foreground">{patient.patientId} · {new Date().getFullYear() - new Date(patient.birthDate).getFullYear()} ans · {patient.gender === 'male' ? t('male') : t('female')}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{patient.phone}</span>
                    {patient.lastDiagnosis && <span className="truncate">· {patient.lastDiagnosis}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium">{t('noResults')}</p>
            <p className="text-xs text-muted-foreground">Essayez de modifier vos critères de recherche</p>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              {t('showing')} {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} {t('of')} {filtered.length} {t('rows')}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{page + 1} / {totalPages}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Add Patient Dialog */}
      <AddPatientDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={(p) => {
          setPatients([p, ...patients]);
          toast.success('Patient ajouté avec succès', { description: `${p.firstName} ${p.lastName} · ${p.patientId}` });
        }}
      />
    </div>
  );
}

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (patient: Patient) => void;
}

function AddPatientDialog({ open, onOpenChange, onAdd }: AddPatientDialogProps) {
  const { t } = useI18n();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [chronicConditions, setChronicConditions] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }
    const newPatient: Patient = {
      id: `p-${Date.now()}`,
      patientId: `PAT-${String(Math.floor(Math.random() * 90000) + 10000)}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      birthDate: birthDate || '1990-01-01',
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      city: city.trim() || undefined,
      bloodType: bloodType.trim() || undefined,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    onAdd(newPatient);
    onOpenChange(false);
    setFirstName(''); setLastName(''); setBirthDate(''); setPhone('');
    setEmail(''); setAddress(''); setCity(''); setBloodType('');
    setAllergies(''); setChronicConditions(''); setMedicalHistory('');
    setCurrentMedications(''); setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('addPatient')}</DialogTitle>
          <DialogDescription>Renseignez les informations du nouveau patient</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Personal Information */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-primary">Informations personnelles</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">{t('firstName')} *</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ahmed" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('lastName')} *</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Benali" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('birthDate')}</Label>
                <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('gender')}</Label>
                <Select value={gender} onValueChange={(v) => setGender(v as 'male' | 'female')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t('male')}</SelectItem>
                    <SelectItem value="female">{t('female')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('phone')} *</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0564 00 00 00" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('email')}</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs">{t('address')}</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Rue, Ville" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('city')}</Label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Khenchela" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('bloodType')}</Label>
                <Select value={bloodType} onValueChange={setBloodType}>
                  <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bt) => (
                      <SelectItem key={bt} value={bt}>{bt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-primary">Informations médicales</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Allergies</Label>
                <Input value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Pénicilline, Iode..." />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Maladies chroniques</Label>
                <Input value={chronicConditions} onChange={(e) => setChronicConditions(e.target.value)} placeholder="Hypertension, Diabète..." />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Antécédents médicaux</Label>
                <Input value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} placeholder="Chirurgie de cataracte..." />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Médicaments actuels</Label>
                <Input value={currentMedications} onChange={(e) => setCurrentMedications(e.target.value)} placeholder="Latanoprost..." />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs">Notes</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes additionnelles..." />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('cancel')}</Button>
          <Button onClick={handleSubmit}>{t('save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
