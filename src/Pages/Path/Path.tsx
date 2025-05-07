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
import AISuggestions from "./AI Suggestions/AISuggestions";
import { useParams } from "react-router-dom";
import {
  ApiCallAddActivity,
  ApiCallDeleteActivity,
  ApiCallEditActivity,
  ApiCallGetPath,
  ApiCallGetUserPaths,
  ApiCallSendPath,
} from "../../services/apiPathService";
import Loading from "../../Components/Loading/Loading";
import Error from "../Error/Error";
import { ApiCallGroup } from "../../services/apiGroupsService";
import { ApiCallUser } from "../../services/apiUserService";
import { updateUser } from "../../Redux/States/user";

const Path = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const pathState = useSelector((store: AppStore) => store.path);
  const userData = useSelector((store: AppStore) => store.user);

  const [coachId, setCoachid] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMyPath, setIsMyPath] = useState<boolean>(!id);
  const [pathData, setPathData] = useState(
    isMyPath ? pathState : emptyPathState
  );

  useEffect(() => {
    if (id) {
      setLoading(true);
      setIsMyPath(false);
      ApiCallGetPath(id)
        .then((resp) => {
          setPathData(resp);
        })
        .catch((err) => {
          setError(err.response?.data.message);
          setPathData(emptyPathState);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      ApiCallGetUserPaths()
        .then((resp) => {
          if (resp[0]) dispatch(updatePath(resp[0]));
        })
        .catch((err) => {
          if (err.response?.status === 400) {
            setPathData(emptyPathState);
          } else {
            setError(err.response?.data.message);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      setPathData(pathState);
    }
  }, [pathState, id]);

  useEffect(() => {
    const groupWithProRoleId = userData.userGroups?.find((userGroup) => {
      return userGroup.role == "P";
    })?.group.id;

    if (groupWithProRoleId)
      ApiCallGroup(groupWithProRoleId).then((res) => {
        setCoachid(
          res.userGroups?.find((userGroup) => {
            return userGroup.role == "M";
          })?.user.id
        );
      });
  }, [userData]);

  useEffect(() => {
    console.log(coachId);
    ApiCallUser(userData.id)
      .then((res) => {
        dispatch(updateUser(res));
      })
      .catch((err) => setError(err.response?.data.message));
  }, []);

  const [activities, setActivities] = useState<Activity[]>(pathData.activities);

  useEffect(() => {
    setActivities(pathData.activities);
  }, [pathData]);

  const [totalHours, setTotalHours] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [maxHours, _] = useState(import.meta.env.VITE_PATH_HOURS | 32);
  const [availableHours, setAvailableHours] = useState(
    import.meta.env.VITE_PATH_HOURS | 32
  );
  const [editingActivity, setEditingActivity] = useState("");

  const HandleSendPath = () => {
    setSendLoading(true);
    ApiCallSendPath(pathData.id, "send")
      .then((res) => {
        setPathData(res);
      })
      .catch((err) => {
        setError(err.response?.data.message);
      })
      .finally(() => {
        setSendLoading(false);
      });
    dispatch(
      updatePath({
        state: "M",
      })
    );
  };
  const HandleUnsendPath = () => {
    setSendLoading(true);
    ApiCallSendPath(pathData.id, "reject")
      .then((res) => {
        setPathData(res);
      })
      .catch((err) => {
        setError(err.response?.data.message);
      })
      .finally(() => {
        setSendLoading(false);
      });
    dispatch(
      updatePath({
        state: "R",
      })
    );
  };

  useEffect(() => {
    console.log(sendLoading);
  }, [sendLoading]);

  const handleDeleteActivity = (id: string) => {
    ApiCallDeleteActivity(id)
      .then(() => {
        setActivities(activities.filter((activity) => activity.id !== id));
        dispatch(
          updatePath({
            activities: activities.filter((activity) => activity.id !== id),
          })
        );
      })
      .catch((err) => {
        setError(err.response?.data.message);
      });
  };

  const handleSetEditingActivity = (id: string) => {
    setEditingActivity(id);
  };

  const handleSaveEditActivity = (updatedActivity: Activity) => {
    ApiCallEditActivity(updatedActivity.id, updatedActivity)
      .then(() => {
        setActivities(
          activities.map((activity) =>
            activity.id == updatedActivity.id ? updatedActivity : activity
          )
        );
      })
      .catch((err) => {
        setError(err.response?.data.message);
      })
      .finally(() => {
        setEditingActivity("");
      });
  };

  const HandleAddActivity = (activity: Activity) => {
    ApiCallAddActivity(activity)
      .then(() => {
        setActivities([...activities, activity]);
      })
      .catch((err) => {
        setError(err.response?.data.message);
      });
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
          pathId={pathData.id}
          name={pathData.name}
          description={pathData.description}
          state={pathData.state}
          maxHours={maxHours}
          coachId={coachId}
          loading={sendLoading}
          totalBudget={totalBudget}
          totalHours={totalHours}
          isMyPath={isMyPath}
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

        {pathData.state == "R" && isMyPath && (
          <>
            <ActivityForm
              pathId={pathData.id}
              HandleAddActivity={HandleAddActivity}
              availableHours={availableHours}
            />

            <AISuggestions
              pathId={pathData.id}
              pathName={pathData.name}
              pathDescription={pathData.description}
              availableHours={availableHours}
              onAcceptSuggestion={HandleAddActivity}
            />
          </>
        )}
      </>
    );
  }
};

export default Path;
