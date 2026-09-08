
import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ThemeProvider } from '@/hooks/use-theme';
import { I18nProvider } from '@/i18n/I18nContext';
import { AuthProvider, getWorkspacePath, useAuth } from '@/auth/AuthContext';
import { ProtectedRoute, RequirePermission, RoleGuard } from '@/auth/guards';
import { AppLayout } from '@/components/layout/AppLayout';
import { Toaster } from '@/components/ui/sonner';

/* =========================================================
   Lazy loaded pages
   ========================================================= */

const Login = lazy(() => import('@/pages/Login'));
const AccessDenied = lazy(() => import('@/pages/AccessDenied'));

const SecretariatWorkspace = lazy(
  () => import('@/pages/SecretariatWorkspace')
);

const AdministrationWorkspace = lazy(
  () => import('@/pages/AdministrationWorkspace')
);

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Patients = lazy(() => import('@/pages/Patients'));
const PatientProfile = lazy(() => import('@/pages/PatientProfile'));
const Consultation = lazy(() => import('@/pages/Consultation'));
const Prescriptions = lazy(() => import('@/pages/Prescriptions'));
const Appointments = lazy(() => import('@/pages/Appointments'));
const WaitingRoom = lazy(() => import('@/pages/WaitingRoom'));
const Examinations = lazy(() => import('@/pages/Examinations'));
const Imaging = lazy(() => import('@/pages/Imaging'));
const Documents = lazy(() => import('@/pages/Documents'));
const Billing = lazy(() => import('@/pages/Billing'));
const Statistics = lazy(() => import('@/pages/Statistics'));
const Medications = lazy(() => import('@/pages/Medications'));
const Users = lazy(() => import('@/pages/Users'));
const AuditLogs = lazy(() => import('@/pages/AuditLogs'));
const Settings = lazy(() => import('@/pages/Settings'));

/* =========================================================
   Loading component
   ========================================================= */

function PageLoader() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

        <p className="text-sm text-muted-foreground">
          Chargement...
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   Default role redirect
   ========================================================= */

function RoleHome() {
  const { user } = useAuth();

  return (
    <Navigate
      to={user ? getWorkspacePath(user.role) : '/login'}
      replace
    />
  );
}

/* =========================================================
   Clinical protected route
   ========================================================= */

type ClinicalPermission =
  | 'patients.read'
  | 'patients.write'
  | 'consultations.read'
  | 'clinical.read'
  | 'prescriptions.read'
  | 'imaging.read';

function ProtectedClinicalRoute({
  children,
  permission,
}: {
  children: ReactNode;
  permission: ClinicalPermission;
}) {
  return (
    <RequirePermission permission={permission}>
      <RoleGuard roles={['medecin']}>
        {children}
      </RoleGuard>
    </RequirePermission>
  );
}

/* =========================================================
   Main application
   ========================================================= */

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>

        {/*
          GitHub Pages configuration

          Repository:
          centre-ophtalmologique

          Published under:
          /centre-ophtalmologique/

          This basename must correspond to the Vite base:
          /centre-ophtalmologique/
        */}
        <BrowserRouter basename="/centre-ophtalmologique">

          <AuthProvider>
            <Routes>

              {/* =================================================
                  Public routes
                  ================================================= */}

              <Route
                path="/login"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Login />
                  </Suspense>
                }
              />

              <Route
                path="/access-denied"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoader />}>
                      <AccessDenied />
                    </Suspense>
                  </ProtectedRoute>
                }
              />

              {/* =================================================
                  Protected application routes
                  ================================================= */}

              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >

                {/* Default route */}
                <Route
                  index
                  element={<RoleHome />}
                />

                {/* =================================================
                    Medical
                    ================================================= */}

                <Route
                  path="medical"
                  element={
                    <RoleGuard roles={['medecin']}>
                      <Suspense fallback={<PageLoader />}>
                        <Dashboard />
                      </Suspense>
                    </RoleGuard>
                  }
                />

                {/* =================================================
                    Patients
                    ================================================= */}

                <Route
                  path="patients"
                  element={
                    <RequirePermission permission="patients.read">
                      <Suspense fallback={<PageLoader />}>
                        <Patients />
                      </Suspense>
                    </RequirePermission>
                  }
                />

                <Route
                  path="patient/:id"
                  element={
                    <ProtectedClinicalRoute permission="patients.read">
                      <Suspense fallback={<PageLoader />}>
                        <PatientProfile />
                      </Suspense>
                    </ProtectedClinicalRoute>
                  }
                />

                {/* =================================================
                    Consultations
                    ================================================= */}

                <Route
                  path="consultation"
                  element={
                    <ProtectedClinicalRoute permission="consultations.read">
                      <Suspense fallback={<PageLoader />}>
                        <Consultation />
                      </Suspense>
                    </ProtectedClinicalRoute>
                  }
                />

                <Route
                  path="consultations"
                  element={
                    <ProtectedClinicalRoute permission="consultations.read">
                      <Suspense fallback={<PageLoader />}>
                        <Consultation />
                      </Suspense>
                    </ProtectedClinicalRoute>
                  }
                />

                {/* =================================================
                    Prescriptions
                    ================================================= */}

                <Route
                  path="prescriptions"
                  element={
                    <ProtectedClinicalRoute permission="prescriptions.read">
                      <Suspense fallback={<PageLoader />}>
                        <Prescriptions />
                      </Suspense>
                    </ProtectedClinicalRoute>
                  }
                />

                {/* =================================================
                    Appointments
                    ================================================= */}

                <Route
                  path="appointments"
                  element={
                    <RequirePermission permission="appointments.read">
                      <Suspense fallback={<PageLoader />}>
                        <Appointments />
                      </Suspense>
                    </RequirePermission>
                  }
                />

                {/* =================================================
                    Waiting room
                    ================================================= */}

                <Route
                  path="waiting-room"
                  element={
                    <RequirePermission permission="appointments.read">
                      <Suspense fallback={<PageLoader />}>
                        <WaitingRoom />
                      </Suspense>
                    </RequirePermission>
                  }
                />

                {/* =================================================
                    Examinations
                    ================================================= */}

                <Route
                  path="examinations"
                  element={
                    <ProtectedClinicalRoute permission="clinical.read">
                      <Suspense fallback={<PageLoader />}>
                        <Examinations />
                      </Suspense>
                    </ProtectedClinicalRoute>
                  }
                />

                {/* =================================================
                    Imaging
                    ================================================= */}

                <Route
                  path="imaging"
                  element={
                    <ProtectedClinicalRoute permission="imaging.read">
                      <Suspense fallback={<PageLoader />}>
                        <Imaging />
                      </Suspense>
                    </ProtectedClinicalRoute>
                  }
                />

                {/* =================================================
                    Documents
                    ================================================= */}

                <Route
                  path="documents"
                  element={
                    <ProtectedClinicalRoute permission="clinical.read">
                      <Suspense fallback={<PageLoader />}>
                        <Documents />
                      </Suspense>
                    </ProtectedClinicalRoute>
                  }
                />

                {/* =================================================
                    Billing
                    ================================================= */}

                <Route
                  path="billing"
                  element={
                    <RoleGuard roles={['medecin']}>
                      <Suspense fallback={<PageLoader />}>
                        <Billing />
                      </Suspense>
                    </RoleGuard>
                  }
                />

                {/* =================================================
                    Statistics
                    ================================================= */}

                <Route
                  path="statistics"
                  element={
                    <RoleGuard
                      roles={['medecin', 'administration']}
                    >
                      <Suspense fallback={<PageLoader />}>
                        <Statistics />
                      </Suspense>
                    </RoleGuard>
                  }
                />

                {/* =================================================
                    Medications
                    ================================================= */}

                <Route
                  path="medications"
                  element={
                    <ProtectedClinicalRoute permission="clinical.read">
                      <Suspense fallback={<PageLoader />}>
                        <Medications />
                      </Suspense>
                    </ProtectedClinicalRoute>
                  }
                />

                {/* =================================================
                    Users
                    ================================================= */}

                <Route
                  path="users"
                  element={
                    <RequirePermission permission="users.read">
                      <Suspense fallback={<PageLoader />}>
                        <Users />
                      </Suspense>
                    </RequirePermission>
                  }
                />

                {/* =================================================
                    Audit logs
                    ================================================= */}

                <Route
                  path="audit-logs"
                  element={
                    <RequirePermission permission="audit.read">
                      <Suspense fallback={<PageLoader />}>
                        <AuditLogs />
                      </Suspense>
                    </RequirePermission>
                  }
                />

                {/* =================================================
                    Settings
                    ================================================= */}

                <Route
                  path="settings"
                  element={
                    <RequirePermission permission="settings.manage">
                      <Suspense fallback={<PageLoader />}>
                        <Settings />
                      </Suspense>
                    </RequirePermission>
                  }
                />

                {/* =================================================
                    Secretariat
                    ================================================= */}

                <Route
                  path="secretariat/*"
                  element={
                    <RoleGuard roles={['secretariat']}>
                      <Suspense fallback={<PageLoader />}>
                        <SecretariatWorkspace />
                      </Suspense>
                    </RoleGuard>
                  }
                />

                {/* =================================================
                    Administration
                    ================================================= */}

                <Route
                  path="administration/*"
                  element={
                    <RoleGuard roles={['administration']}>
                      <Suspense fallback={<PageLoader />}>
                        <AdministrationWorkspace />
                      </Suspense>
                    </RoleGuard>
                  }
                />

                {/* =================================================
                    Fallback
                    ================================================= */}

                <Route
                  path="*"
                  element={<RoleHome />}
                />

              </Route>
            </Routes>
          </AuthProvider>

        </BrowserRouter>

        <Toaster />

      </I18nProvider>
    </ThemeProvider>
  );
}