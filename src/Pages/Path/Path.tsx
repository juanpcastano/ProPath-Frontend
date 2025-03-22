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

const Path = () => {
  const pathData = useSelector((store: AppStore) => store.path);
  const userData = useSelector((store: AppStore) => store.user);
  const dispatch = useDispatch();
  const [activities, setActivities] = useState<Activity[]>(
    pathData?.activities || []
  );

  const [totalHours, setTotalHours] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [minHours, _] = useState(import.meta.env.VITE_MIN_HOURS | 36);
  const [editingActivity, setEditingActivity] = useState("");

  const sendPath = () => {};

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

  if (JSON.stringify(pathData) === JSON.stringify(emptyPathState)) {
    if (!userData.pathId) {
      return <InitialForm />;
    } else {
      <div className={`${styles.mainContainer} `}>
        <h1>Ocurrió un error al encontrar la información de tu path</h1>
      </div>;
    }
  } else {
    return (
      <>
        <Title
          name={pathData.name}
          description={pathData.description}
          minHours={minHours}
          totalBudget={totalBudget}
          totalHours={totalHours}
          handleSendPath={sendPath}
        />

        {activities.map((activity, _) => {
          return (<ActivityBlock 
            editingActivity={editingActivity}
            activity={activity}
            pathId={pathData.id}
            handleDelete={handleDelete}
            handleCommentSubmit={handleCommentSubmit}
            handleSetEditingActivity={handleSetEditingActivity}
            handleSaveEdit={handleSaveEdit}
          />)
        })}

        <ActivityForm
        pathId={pathData.id}
        HandleAddActivity={HandleAddActivity}
        />

      </>
    );
  }
};

export default Path;
