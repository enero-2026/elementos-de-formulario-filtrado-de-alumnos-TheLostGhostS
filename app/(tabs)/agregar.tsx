import * as React from 'react';
import { Modal, Portal, Text, Button } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { View, StyleSheet, Animated } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface portInfo {
    visible: boolean;
    onDismiss: () => void;
    onChange: (nombre: string, matricula: string) => void;
    alumnosExistentes: { nombre: string; matricula: string }[];
}

export function AddingModal({ visible, onDismiss, onChange, alumnosExistentes }: portInfo) {
    const [textNombre, setTextNombre] = React.useState("");
    const [textMatricula, setTextMatricula] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);
    const shakeAnim = React.useRef(new Animated.Value(0)).current;

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start();
    };

    const clearText = () => {
        setTextNombre("");
        setTextMatricula("");
        setError(null);
    };

    const checkout = () => {
        clearText();
        onDismiss();
    };

    const saving = () => {
        const nombreTrimmed = textNombre.trim();
        const matriculaTrimmed = textMatricula.trim();

        if (!nombreTrimmed || !matriculaTrimmed) {
            setError("Por favor completa todos los campos.");
            shake();
            return;
        }

        const matriculaExiste = alumnosExistentes.some(
            (a) => a.matricula === matriculaTrimmed
        );
        
        if (matriculaExiste) {
            setError(`La matrícula ${matriculaTrimmed} ya está registrada.`);
            shake();
            return;
        }

        const nombreExiste = alumnosExistentes.some(
            (a) => a.nombre.toLowerCase() === nombreTrimmed.toLowerCase()
        );

        if (nombreExiste) {
            setError(`El alumno "${nombreTrimmed}" ya existe.`);
            shake();
            return;
        }

        onChange(nombreTrimmed.toUpperCase(), matriculaTrimmed);
        clearText();
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={checkout}
                contentContainerStyle={styles.modalContainer}
            >
                <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.iconCircle}>
                            <MaterialIcons name="person-add" size={26} color="#fff" />
                        </View>
                        <Text style={styles.title}>Nuevo Alumno</Text>
                        <Text style={styles.subtitle}>Ingresa los datos del estudiante</Text>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Inputs */}
                    <View style={styles.inputGroup}>
                        <TextInput
                            label="Nombre completo"
                            value={textNombre}
                            onChangeText={(text) => { setTextNombre(text); setError(null); }}
                            mode="outlined"
                            left={<TextInput.Icon icon="account" />}
                            outlineColor="#d1d5db"
                            activeOutlineColor="#4f46e5"
                            style={styles.input}
                            autoCapitalize="characters"
                        />
                        <TextInput
                            label="Matrícula"
                            value={textMatricula}
                            onChangeText={(text) => { setTextMatricula(text); setError(null); }}
                            mode="outlined"
                            left={<TextInput.Icon icon="card-account-details" />}
                            outlineColor="#d1d5db"
                            activeOutlineColor="#4f46e5"
                            style={styles.input}
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Error message */}
                    {error && (
                        <View style={styles.errorBox}>
                            <MaterialIcons name="error-outline" size={16} color="#dc2626" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    {/* Buttons */}
                    <View style={styles.buttonRow}>
                        <Button
                            mode="outlined"
                            onPress={checkout}
                            style={styles.cancelButton}
                            textColor="#6b7280"
                        >
                            Cancelar
                        </Button>
                        <Button
                            mode="contained"
                            onPress={saving}
                            style={styles.saveButton}
                            buttonColor="#4f46e5"
                            icon="check"
                        >
                            Guardar
                        </Button>
                    </View>
                </Animated.View>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        alignItems: 'center',
        marginBottom: 16,
    },
    iconCircle: {
        backgroundColor: '#4f46e5',
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        letterSpacing: 0.3,
    },
    subtitle: {
        fontSize: 13,
        color: '#9ca3af',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#f3f4f6',
        marginBottom: 18,
    },
    inputGroup: {
        gap: 12,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
    },
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef2f2',
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
        gap: 6,
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    errorText: {
        color: '#dc2626',
        fontSize: 13,
        flex: 1,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 20,
    },
    cancelButton: {
        borderColor: '#e5e7eb',
        borderRadius: 10,
    },
    saveButton: {
        borderRadius: 10,
    },
});