import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppStore } from "../../Redux/store";

import { useDispatch } from "react-redux";
import styles from "./Path.module.css";
import { generateUUID } from "../../services/uuidGenerator";
import { Activity, Comment } from "../../models/path.model";
import { emptyPathState } from "../../Redux/States/path";
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
  ApiCallUpdatePath,
} from "../../services/apiPathService";
import Loading from "../../Components/Loading/Loading";
import Error from "../Error/Error";
import { ApiCallGroup } from "../../services/apiGroupsService";
import { ApiCallUser } from "../../services/apiUserService";
import { EmptyUserState, updateUser } from "../../Redux/States/user";
import { UserInfo } from "../../models/user.model";
import { getActualQuartile, parsePath } from "../../services/quartile";

const Path = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const userData = useSelector((store: AppStore) => store.user);

  const [coachId, setCoachid] = useState<string | undefined>(undefined);
  const [authorData, setAuthorData] = useState<UserInfo>(EmptyUserState);

  const [amICoachOfThisPath, setAmICoachOfThisPath] = useState<
    boolean | undefined
  >(false);

  const [loading, setLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMyPath, setIsMyPath] = useState<boolean>(!id);
  const [pathData, setPathData] = useState(emptyPathState);

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
          const parsedPaths = resp.map((p) => {
            return parsePath(p);
          });
          const actualPath = parsedPaths.find((p) => {
            return p.quartileString == getActualQuartile();
          });
          if (actualPath) {
            setPathData(actualPath);
          } else {
            setPathData(emptyPathState);
          }
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
    setAmICoachOfThisPath(
      authorData.userGroups?.some(async (userGroup) => {
        try {
          const res = await ApiCallGroup(userGroup.group.id);
          res.userGroups?.some((ug) => {
            ug.role == "M";
          });
        } catch (err: any) {
          return setError(err.response?.data.message);
        }
      })
    );
  }, [authorData]);

  useEffect(() => {
    if (isMyPath) {
      setAuthorData(userData);
    } else {
      if (pathData.userId)
        ApiCallUser(pathData.userId)
          .then((res) => {
            setAuthorData(res);
          })
          .catch((err) => {
            setError(err.response?.data.message);
          });
    }
    const groupWithProRoleId = authorData?.userGroups?.find((userGroup) => {
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
  };
  const HandleApprovePath = () => {
    setSendLoading(true);
    ApiCallSendPath(pathData.id, "approve")
      .then((res) => {
        setPathData(res);
      })
      .catch((err) => {
        setError(err.response?.data.message);
      })
      .finally(() => {
        setSendLoading(false);
      });
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
  };

  const handleDeleteActivity = (id: string) => {
    ApiCallDeleteActivity(id)
      .then(() => {
        setActivities(activities.filter((activity) => activity.id !== id));
      })
      .catch((err) => {
        setError(err.response?.data.message);
      });
  };

  const handleSetEditingActivity = (id: string) => {
    setEditingActivity(id);
  };

  const HandleEditTitle = (path: {
    id: string;
    name: string;
    description: string;
  }) => {
    ApiCallUpdatePath(path)
      .then((res) => {
        setPathData(res);
      })
      .catch((err) => {
        console.error("Err: ", err.response?.data.message);
      });
  };

  const HandleSaveEditActivity = (updatedActivity: Activity) => {
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
          pathState={pathData.state}
          coachId={coachId}
          loading={sendLoading}
          totalBudget={totalBudget}
          amICoachOfThisPath={true}
          totalHours={totalHours}
          isMyPath={isMyPath}
          handleSendPath={HandleSendPath}
          handleUnsendPath={HandleUnsendPath}
          handleApprovePath={HandleApprovePath}
          handleRejectPath={HandleUnsendPath}
          handleEditTitle={HandleEditTitle}
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
              handleSaveEdit={HandleSaveEditActivity}
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
