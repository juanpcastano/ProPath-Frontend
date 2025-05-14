import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppStore } from "../../Redux/store";

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
import { EmptyUserState } from "../../Redux/States/user";
import { UserInfo } from "../../models/user.model";
import { getActualQuartile, parsePath } from "../../services/quartile";

const Path = () => {
  const { id } = useParams();
  const userData = useSelector((store: AppStore) => store.user);

  const [coachId, setCoachid] = useState<string | undefined>(undefined);
  const [authorData, setAuthorData] = useState<UserInfo>(EmptyUserState);

  const [amICoachOfThisPath, setAmICoachOfThisPath] = useState<boolean>(false);

  const [isActual, setIsActual] = useState(false);
  const [editable, setEditable] = useState(false);
  const [aproving, setAproving] = useState(false);
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [isMyPath, setIsMyPath] = useState<boolean>(!id);

  const [loading, setLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);
  const [error, setError] = useState("");
  const [pathData, setPathData] = useState(emptyPathState);

  useEffect(() => {
    setEditable(!id && isActual && pathData.state == "R");
    setAproving(
      amICoachOfThisPath && isActual && !isMyPath && ["M","A"].includes(pathData.state)
    );
    setIsMyPath(!id || pathData.userId == userData.id);
    setIsEditingPage(!id && isActual);
  }, [amICoachOfThisPath, pathData]);

  useEffect(() => {
    const fetchPathData = async () => {
      setLoading(true);
      try {
        if (id) {
          const resp = await ApiCallGetPath(id);
          setIsActual(parsePath(resp).quartileString == getActualQuartile());
          setPathData(resp);
        } else {
          const resp = await ApiCallGetUserPaths();
          const parsedPaths = resp.map(parsePath);
          const actualPath = parsedPaths.find(
            (p) => p.quartileString === getActualQuartile()
          );
          setIsActual(true);
          setPathData(actualPath || emptyPathState);
        }
      } catch (err: any) {
        if (!id && err.response?.status === 400) {
          setPathData(emptyPathState);
        } else {
          setError(err.response?.data.message);
          setPathData(emptyPathState);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPathData();
  }, [id]);

  useEffect(() => {
    const groupsWhereAuthorIsPro = authorData.userGroups?.filter((ug) => {
      return ug.role == "P";
    });
    setAmICoachOfThisPath(
      groupsWhereAuthorIsPro?.some(async (userGroup) => {
        try {
          const groupData = await ApiCallGroup(userGroup.group.id);
          groupData.userGroups?.some((ug) => {
            return ug.role == "M" && ug.user.id == userData.id;
          });
        } catch (err: any) {
          return setError(err.response?.data.message);
        }
      }) || false
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
  }, [pathData]);

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

  const HandleActivatePath = () => {
    setSendLoading(true);
    ApiCallSendPath(pathData.id, "activate")
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
          authorName={authorData.name}
          description={pathData.description}
          state={isActual ? pathData.state : "F"}
          maxHours={maxHours}
          pathState={pathData.state}
          coachId={coachId}
          loading={sendLoading}
          totalBudget={totalBudget}
          amICoachOfThisPath={amICoachOfThisPath}
          totalHours={totalHours}
          isMyPath={isMyPath}
          handleSendPath={HandleSendPath}
          handleUnsendPath={HandleUnsendPath}
          handleApprovePath={HandleApprovePath}
          handleActivatePath={HandleActivatePath}
          handleRejectPath={HandleUnsendPath}
          handleEditTitle={HandleEditTitle}
          isEditingPage={isEditingPage}
          editable={editable}
          aproving={aproving}
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
              editable={editable}
            />
          );
        })}

        {editable && (
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
