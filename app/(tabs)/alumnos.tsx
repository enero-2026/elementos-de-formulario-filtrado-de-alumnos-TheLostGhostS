import { FlatList, View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useEffect, useState, useRef } from "react";
import { TextInput, Text, Button, Surface, Menu } from 'react-native-paper';
import { AddingModal } from "./agregar";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Alumno = {
  nombre: string;
  matricula: string;
};

type SortMode = 'none' | 'az' | 'za' | 'matricula';

const SORT_OPTIONS: { mode: SortMode; label: string; icon: string }[] = [
  { mode: 'none',      label: 'Sin ordenar',         icon: 'format-list-bulleted' },
  { mode: 'az',        label: 'A → Z (nombre)',       icon: 'sort-alphabetical-ascending' },
  { mode: 'za',        label: 'Z → A (nombre)',       icon: 'sort-alphabetical-descending' },
  { mode: 'matricula', label: 'Por matrícula',        icon: 'sort-numeric-ascending' },
];

export default function Alumnos() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [buscaAlumno, setBuscaAlumno] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>('none');
  const [menuVisible, setMenuVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const addAlumno = (nombre: string, matricula: string) => {
    const nuevoAlumno: Alumno = { nombre, matricula };
    setAlumnos((prev) => [...prev, nuevoAlumno]);
    hideModal();
  };

  const getSortedAlumnos = (list: Alumno[]): Alumno[] => {
    switch (sortMode) {
      case 'az':        return [...list].sort((a, b) => a.nombre.localeCompare(b.nombre));
      case 'za':        return [...list].sort((a, b) => b.nombre.localeCompare(a.nombre));
      case 'matricula': return [...list].sort((a, b) => a.matricula.localeCompare(b.matricula, undefined, { numeric: true }));
      default:          return list;
    }
  };

  const activeSortLabel = SORT_OPTIONS.find((o) => o.mode === sortMode)?.label ?? 'Ordenar';

  useEffect(() => {
    setTimeout(() => {
      setCargando(false);
      setAlumnos([
        { nombre: 'CANDELARIA MORA SAMANTHA', matricula: '2114354' },
        { nombre: 'CANTU SILVA JAVIER', matricula: '2111889' },
        { nombre: 'CARMONA LOZANO ANGEL EMILIANO', matricula: '2069119' },
        { nombre: 'CASTILLO ACOSTA JORGE', matricula: '2132842' },
        { nombre: 'DAVILA GONZALEZ ALDO ADRIAN', matricula: '1994122' },
        { nombre: 'DURAN BARRIENTOS FABRIZIO', matricula: '2018230' },
        { nombre: 'FLORES GONZALEZ SEBASTIAN', matricula: '2104564' },
        { nombre: 'FLORES LOPEZ DIEGO', matricula: '2066033' },
        { nombre: 'FLORES MARTINEZ ERICK ADRIAN', matricula: '2132976' },
        { nombre: 'GARZA AVALOS DIEGO', matricula: '2066114' },
        { nombre: 'GONZALEZ OVALLE CHRISTIAN GABRIEL', matricula: '2031243' },
        { nombre: 'GRANJA PEÑA DIEGO', matricula: '2064733' },
        { nombre: 'IBARRA RODRIGUEZ ALEXIS', matricula: '2031590' },
        { nombre: 'MARTINEZ ELIAS ANGEL SEBASTIAN', matricula: '2064891' },
        { nombre: 'MENDIETA GONZALEZ ESMERALDA GABRIELA', matricula: '2094647' },
        { nombre: 'MIRELES VELAZQUEZ ALEJANDRO', matricula: '2005102' },
        { nombre: 'MONSIVAIS SALAZAR ANDRES', matricula: '2064574' },
        { nombre: 'PARRAZALEZ VALDESPINO MARTHA JULIETA', matricula: '2024783' },
        { nombre: 'PENA MUNGARRO LUIS ANGEL', matricula: '2066077' },
        { nombre: 'PUENTE REYNOSO JULIO CESAR', matricula: '2092151' },
        { nombre: 'RAMIREZ LOPEZ BRYAN', matricula: '2103708' },
        { nombre: 'RAMOS AVILA LILIANA VALERIA', matricula: '2115192' },
        { nombre: 'RICO JAUREGUI MAURICIO', matricula: '2037503' },
        { nombre: 'RIVERA LUNA ADRIAN', matricula: '2131513' },
        { nombre: 'RIVERA REYNA JOSE EMILIO', matricula: '2013503' },
        { nombre: 'RODRIGUEZ OLVERA ROSA ISELA', matricula: '2004613' },
        { nombre: 'RODRIGUEZ RODRIGUEZ ANGEL AZAEL', matricula: '2133022' },
        { nombre: 'SANCHEZ GALARZA JUAN CARLOS', matricula: '2026061' },
        { nombre: 'SOLIS ORTIZ ALFREDO', matricula: '2095320' },
        { nombre: 'VELAZQUEZ ABREGO HERWIN DANIEL', matricula: '2025350' },
        { nombre: 'VILLAGRA RODRIGUEZ ANDRES NEHUEL', matricula: '2103895' },
        { nombre: 'ZACATENCO OLIVE RODRIGO', matricula: '1857791' },
        { nombre: 'ZAVALA CANTU TERESA MARGARITA', matricula: '2025218' },
      ]);
    }, 500);
  }, []);

  const alumnosFiltrados = getSortedAlumnos(
    alumnos.filter((alumno) =>
      alumno.nombre.toLowerCase().includes(buscaAlumno.toLowerCase()) ||
      alumno.matricula.includes(buscaAlumno)
    )
  );

  // Iniciales para el avatar
  const getInitials = (nombre: string) => {
    const parts = nombre.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`;
    return parts[0][0];
  };

  // Color consistente por nombre
  const getAvatarColor = (nombre: string) => {
    const colors = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777'];
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  if (cargando) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="school" size={48} color="#c7d2fe" />
        <Text style={styles.loadingText}>Cargando alumnos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Lista de Alumnos</Text>
          <Text style={styles.headerSub}>
            {alumnos.length} estudiantes registrados
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={showModal}
          buttonColor="#4f46e5"
          icon="plus"
          style={styles.addButton}
          labelStyle={{ fontSize: 13 }}
        >
          Agregar
        </Button>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <TextInput
          label="Buscar por nombre o matrícula"
          value={buscaAlumno}
          onChangeText={setBuscaAlumno}
          mode="outlined"
          left={<TextInput.Icon icon="magnify" />}
          right={buscaAlumno ? <TextInput.Icon icon="close" onPress={() => setBuscaAlumno("")} /> : null}
          outlineColor="#e5e7eb"
          activeOutlineColor="#4f46e5"
          style={styles.searchInput}
          dense
        />

        {/* Sort dropdown */}
        <View style={styles.sortRow}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode={sortMode !== 'none' ? 'contained' : 'outlined'}
                onPress={() => setMenuVisible(true)}
                icon="sort"
                buttonColor={sortMode !== 'none' ? '#4f46e5' : undefined}
                textColor={sortMode !== 'none' ? '#fff' : '#6b7280'}
                style={styles.sortButton}
                labelStyle={{ fontSize: 12 }}
                compact
              >
                {activeSortLabel}
              </Button>
            }
            contentStyle={styles.menuContent}
          >
            {SORT_OPTIONS.map((opt) => (
              <Menu.Item
                key={opt.mode}
                onPress={() => { setSortMode(opt.mode); setMenuVisible(false); }}
                title={opt.label}
                leadingIcon={opt.icon}
                titleStyle={[
                  styles.menuItemTitle,
                  sortMode === opt.mode && styles.menuItemActive,
                ]}
                style={sortMode === opt.mode ? styles.menuItemSelectedBg : undefined}
              />
            ))}
          </Menu>

          {buscaAlumno.length > 0 && (
            <Text style={styles.filterResult}>
              {alumnosFiltrados.length} resultado{alumnosFiltrados.length !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
      </View>

      {/* List */}
      {alumnosFiltrados.length === 0 ? (
        <View style={styles.centered}>
          <MaterialIcons name="search-off" size={44} color="#d1d5db" />
          <Text style={styles.emptyText}>No se encontraron alumnos</Text>
        </View>
      ) : (
        <FlatList
          data={alumnosFiltrados}
          keyExtractor={(item, index) => `${item.matricula}-${index}`}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => {
            const color = getAvatarColor(item.nombre);
            const initials = getInitials(item.nombre);
            return (
              <Surface style={styles.card} elevation={0}>
                <View style={[styles.avatar, { backgroundColor: color }]}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardNombre}>{item.nombre}</Text>
                  <View style={styles.matriculaRow}>
                    <MaterialIcons name="badge" size={13} color="#9ca3af" />
                    <Text style={styles.cardMatricula}>{item.matricula}</Text>
                  </View>
                </View>
              </Surface>
            );
          }}
        />
      )}

      <AddingModal
        visible={visible}
        onDismiss={hideModal}
        onChange={addAlumno}
        alumnosExistentes={alumnos}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 52,
    paddingBottom: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  addButton: {
    borderRadius: 10,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#fff',
    fontSize: 14,
  },
  filterResult: {
    fontSize: 12,
    color: '#6b7280',
    alignSelf: 'center',
    marginLeft: 8,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  sortButton: {
    borderRadius: 8,
    borderColor: '#e5e7eb',
  },
  menuContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    marginTop: 4,
  },
  menuItemTitle: {
    fontSize: 14,
    color: '#374151',
  },
  menuItemActive: {
    color: '#4f46e5',
    fontWeight: '700',
  },
  menuItemSelectedBg: {
    backgroundColor: '#eef2ff',
  },
  list: {
    padding: 14,
    paddingBottom: 30,
  },
  separator: {
    height: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  cardContent: {
    flex: 1,
  },
  cardNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    letterSpacing: 0.1,
  },
  matriculaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  cardMatricula: {
    fontSize: 12,
    color: '#9cas3af',
    letterSpacing: 0.5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: 15,
    marginTop: 8,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 15,
    marginTop: 6,
  },
});