import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppStore } from "../../Redux/store";

import { useDispatch } from "react-redux";
import styles from "./Path.module.css";
import { generateUUID } from "../../services/uuidGenerator";
import { Activity, Comment } from "../../models/path.model";
import { emptyPathState, updatePath } from "../../Redux/States/path";
import InitialForm from "./Initial Form/InitialForm";
import Title from "./Title/Title";
import ActivityBlock from "./Activity Block/ActivityBlock";
import ActivityForm from "./Activity Form/ActivityForm";
import { useParams } from "react-router-dom";
import { ApiCallGetPath, ApiCallGetUserPaths } from "../../services/apiPathService";
import Loading from "../../Components/Loading/Loading";
import Error from "../Error/Error";

const Path = () => {
  const { id } = useParams();
  const pathState = useSelector((store: AppStore) => store.path);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pathData, setPathData] = useState(pathState);
  const [isMyPath, setIsMyPath] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setIsMyPath(false);
      ApiCallGetPath(id)
        .then((resp) => {
          setPathData(resp);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.response?.data.message);
          setPathData(emptyPathState);
          setLoading(false);
        });
    } else {
      ApiCallGetUserPaths().then((resp) => {
        setPathData(resp[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError(err.response?.data.message);
        setPathData(emptyPathState);
        setLoading(false);
      });
      setPathData(pathState);
      setLoading(false);
      setIsMyPath(true);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      setPathData(pathState);
    }
  }, [pathState, id]);

  const userData = useSelector((store: AppStore) => store.user);
  const dispatch = useDispatch();
  const [activities, setActivities] = useState<Activity[]>(
    pathData?.activities || []
  );

  const [totalHours, setTotalHours] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [maxHours, _] = useState(import.meta.env.VITE_PATH_HOURS | 32);
  const [availableHours, setAvailableHours] = useState(
    import.meta.env.VITE_PATH_HOURS | 32
  );
  const [editingActivity, setEditingActivity] = useState("");

  const HandleSendPath = () => {
    dispatch(
      updatePath({
        state: "M",
      })
    );
  };
  const HandleUnsendPath = () => {
    dispatch(
      updatePath({
        state: "R",
      })
    );
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter((activity) => activity.id !== id));
    dispatch(
      updatePath({
        activities: activities.filter((activity) => activity.id !== id),
      })
    );
  };

  const handleSetEditingActivity = (id: string) => {
    setEditingActivity(id);
  };

  const handleSaveEditActivity = (updatedActivity: Activity) => {
    setActivities(
      activities.map((activity) =>
        activity.id == updatedActivity.id ? updatedActivity : activity
      )
    );
    dispatch(
      updatePath({
        activities: activities.map((activity) =>
          activity.id == updatedActivity.id ? updatedActivity : activity
        ),
      })
    );
    setEditingActivity("");
  };

  const HandleAddActivity = (activity: Activity) => {
    setActivities([...activities, activity]);
  };

  const handleCommentSubmit = (activityId: string, commentMessage: string) => {
    if (!commentMessage.trim()) return;

    const updatedActivities = activities.map((activity) => {
      if (activity.id === activityId) {
        const newComment: Comment = {
          id: generateUUID(),
          authorName: userData.name,
          message: commentMessage,
          date: new Date(),
        };
        const updatedComments = activity.comments
          ? [...activity.comments, newComment]
          : [newComment];

        return {
          ...activity,
          comments: updatedComments,
        };
      }
      return activity;
    });

    setActivities(updatedActivities);
    dispatch(updatePath({ activities: updatedActivities }));
  };

  useEffect(() => {
    setTotalHours(
      activities.reduce((sum, activity) => sum + activity.hours, 0)
    );
    setTotalBudget(
      activities.reduce((sum, activity) => sum + activity.budget, 0)
    );
    dispatch(updatePath({ activities: activities }));
  }, [activities]);

  useEffect(() => {
    setAvailableHours(maxHours - totalHours);
  }, [totalHours]);

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (JSON.stringify(pathData) === JSON.stringify(emptyPathState)) {
    if (isMyPath) {
      return <InitialForm />;
    } else {
      return (
        <div className={`${styles.mainContainer} `}>
          <p className={styles.info}>
            Ocurrió un error al encontrar la información de este path
          </p>
        </div>
      );
    }
  } else if (error) return <Error error={error} />;
  else {
    return (
      <>
        <Title
          name={pathData.name}
          description={pathData.description}
          state={pathData.state}
          maxHours={maxHours}
          totalBudget={totalBudget}
          totalHours={totalHours}
          handleSendPath={HandleSendPath}
          handleUnsendPath={HandleUnsendPath}
          actionable={isMyPath && pathData.state == "R"}
        />

        {activities.map((activity, key) => {
          return (
            <ActivityBlock
              key={key}
              editingActivity={editingActivity}
              activity={activity}
              pathId={pathData.id}
              handleDelete={handleDeleteActivity}
              handleCommentSubmit={handleCommentSubmit}
              handleSetEditingActivity={handleSetEditingActivity}
              handleSaveEdit={handleSaveEditActivity}
              actionable={isMyPath && pathData.state == "R"}
            />
          );
        })}

        {pathData.state == "R" && (
          <ActivityForm
            pathId={pathData.id}
            HandleAddActivity={HandleAddActivity}
            availableHours={availableHours}
          />
        )}
      </>
    );
  }
};

export default Path;
