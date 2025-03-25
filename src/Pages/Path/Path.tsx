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
import { useLocation } from "react-router-dom";
import { ApiCallPath } from "../../services/apiPathService";
import Loading from "../../Components/Loading/Loading";

const Path = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [loading, setLoading] = useState(true);

  const pathState = useSelector((store: AppStore) => store.path);

  const [pathData, setPathData] = useState(pathState);

  useEffect(() => {
    if (id) {
      setLoading(true)
      ApiCallPath(id)
        .then((resp) => {
          console.log(resp);
          setPathData(resp);
          setLoading(false);
        })
        .catch(() => {
          setPathData(emptyPathState);
          setLoading(false);
        });
    } else {
      setPathData(pathState);
      setLoading(false);
    }
  }, [id]);

  const userData = useSelector((store: AppStore) => store.user);
  const dispatch = useDispatch();
  const [activities, setActivities] = useState<Activity[]>(
    pathData?.activities || []
  );

  const [totalHours, setTotalHours] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [minHours, _] = useState(import.meta.env.VITE_MIN_HOURS | 36);
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

  const handleDelete = (id: string) => {
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

  const handleSaveEdit = (updatedActivity: Activity) => {
    console.log(updatedActivity);
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

  if (loading) {
    console.log(loading);
    
    return <Loading/>;
  } else if (JSON.stringify(pathData) === JSON.stringify(emptyPathState)) {
    if (!userData.pathId) {
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
  } else {
    return (
      <>
        <Title
          name={pathData.name}
          description={pathData.description}
          state={pathData.state}
          minHours={minHours}
          totalBudget={totalBudget}
          totalHours={totalHours}
          handleSendPath={HandleSendPath}
          handleUnsendPath={HandleUnsendPath}
        />

        {activities.map((activity, _) => {
          return (
            <ActivityBlock
              editingActivity={editingActivity}
              activity={activity}
              pathId={pathData.id}
              handleDelete={handleDelete}
              handleCommentSubmit={handleCommentSubmit}
              handleSetEditingActivity={handleSetEditingActivity}
              handleSaveEdit={handleSaveEdit}
            />
          );
        })}

        {pathData.state == "R" && (
          <ActivityForm
            pathId={pathData.id}
            HandleAddActivity={HandleAddActivity}
          />
        )}
      </>
    );
  }
};

export default Path;
