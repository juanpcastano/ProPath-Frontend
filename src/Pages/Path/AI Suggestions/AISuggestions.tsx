import { useState } from "react";
import { Activity } from "../../../models/path.model";
import { ApiCallAISuggestions } from "../../../services/apiAISugestionsService";
import styles from "./AISuggestions.module.css";
import { generateUUID } from "../../../services/uuidGenerator";

interface AISuggestionsProps {
  pathName: string;
  pathDescription: string;
  availableHours: number;
  pathId: string;  // Añadido pathId como prop
  onAcceptSuggestion: (activity: Activity) => void;
}

interface SuggestionResponse {
  activities: {
    budget: number;
    description: string;
    finalDate: string;
    hours: number;
    initialDate: string;
    name: string;
  }[];
  description: string;
  name: string;
  valid: boolean;
  validexplain: string;
}

const AISuggestions = ({
  pathName,
  pathDescription,
  availableHours,
  pathId,  // Añadido pathId como prop
  onAcceptSuggestion,
}: AISuggestionsProps) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionResponse | null>(null);
  const [error, setError] = useState("");

  const handleGetSuggestions = async () => {
    setLoading(true);
    setError("");
    
    try {
      const result = await ApiCallAISuggestions({
        name: pathName,
        description: pathDescription,
      });
      setSuggestions(result);
    } catch (err) {
      console.error("Error getting AI suggestions:", err);
      setError("No se pudieron obtener sugerencias en este momento. Inténtelo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSuggestion = (suggestionActivity: any) => {
    if (availableHours < suggestionActivity.hours) {
      setError(`No hay suficientes horas disponibles. Esta actividad requiere ${suggestionActivity.hours} horas y solo tiene ${availableHours} horas disponibles.`);
      return;
    }

    const newActivity: Activity = {
      id: generateUUID(),
      name: suggestionActivity.name,
      description: suggestionActivity.description,
      hours: suggestionActivity.hours,
      initialDate: new Date(suggestionActivity.initialDate),
      finalDate: new Date(suggestionActivity.finalDate),
      budget: suggestionActivity.budget,
      state: "Pendiente",
      pathId: pathId,  // Usando el pathId recibido como prop
      comments: [],
    };

    onAcceptSuggestion(newActivity);
    
    // Remove the suggestion from the list
    if (suggestions) {
      setSuggestions({
        ...suggestions,
        activities: suggestions.activities.filter(
          (activity) => activity.name !== suggestionActivity.name
        ),
      });
    }
  };

  return (
    <div className={styles.mainContainer}>
      <h2 className={styles.noMarginTop}>Sugerencias de IA</h2>
      
      {!suggestions && !loading && (
        <div className={styles.suggestionsPrompt}>
          <p>Obtenga sugerencias de actividades basadas en el nombre y descripción de su path.</p>
          <button 
            onClick={handleGetSuggestions} 
            className={`${styles.button} dark-gradient-primary`}
            disabled={loading}
          >
            {loading ? "Generando..." : "Obtener Sugerencias"}
          </button>
        </div>
      )}

      {loading && (
        <div className={styles.loadingContainer}>
          <p>Generando sugerencias...</p>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {suggestions && !loading && (
        <div className={styles.suggestionsContainer}>
          <div className={styles.suggestionHeader}>
            <div>
              <h3>Sugerencia de mejora para su path:</h3>
              <p><strong>Nombre sugerido:</strong> {suggestions.name}</p>
              <p><strong>Descripción sugerida:</strong> {suggestions.description}</p>
              <p>{suggestions.validexplain}</p>
            </div>
          </div>

          {suggestions.activities.length === 0 ? (
            <p>No hay más sugerencias disponibles.</p>
          ) : (
            <>
              <h3>Actividades sugeridas:</h3>
              {suggestions.activities.map((activity, index) => (
                <div key={index} className={styles.activitySuggestion}>
                  <div className={styles.activityInfo}>
                    <h4>{activity.name}</h4>
                    <p>{activity.description}</p>
                    <div className={styles.activityDetails}>
                      <span>Horas: {activity.hours}</span>
                      <span>Presupuesto: ${activity.budget}</span>
                      <span>Fecha inicial: {new Date(activity.initialDate).toLocaleDateString()}</span>
                      <span>Fecha final: {new Date(activity.finalDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={styles.activityActions}>
                    <button
                      onClick={() => handleAcceptSuggestion(activity)}
                      className={`${styles.acceptButton} dark-gradient-primary`}
                      disabled={availableHours < activity.hours}
                      title={availableHours < activity.hours ? `No hay suficientes horas disponibles` : ""}
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => {
                        setSuggestions({
                          ...suggestions,
                          activities: suggestions.activities.filter((_, i) => i !== index)
                        });
                      }}
                      className={`${styles.rejectButton} dark-gradient-secondary`}
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          <button
            onClick={() => {
              setSuggestions(null);
              setError("");
            }}
            className={`${styles.button} dark-gradient-secondary`}
          >
            Cerrar Sugerencias
          </button>
        </div>
      )}
    </div>
  );
};

export default AISuggestions;