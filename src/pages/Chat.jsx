import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getVehicleById } from "../services/vehicleService";
import {
  getVehicleConversation,
  createQuestion,
  answerQuestion,
  getMyQuestions,
  getMyVehicleQuestions,
  deleteChatConversation,
} from "../services/questionService";

function Chat() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const vehicleId = searchParams.get("vehicleId");
  const askedById = searchParams.get("askedBy");

  const [vehicle, setVehicle] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [answerTexts, setAnswerTexts] = useState({});
  const [loading, setLoading] = useState(true);

  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const token = sessionStorage.getItem("token");

  const loadConversationByVehicle = async () => {
    try {
      if (!vehicleId || !askedById) {
        console.warn("Faltan vehicleId o askedById para cargar la conversación.");
        setConversation([]);
        setVehicle(null);
        return;
      }

      setLoading(true);

      const vehicleData = await getVehicleById(vehicleId);
      setVehicle(vehicleData.data || null);

      const conversationData = await getVehicleConversation(vehicleId, askedById);
      let chats = conversationData.data || [];

      chats = chats.filter((item) => {
        const currentAskedById =
          item.askedBy?._id || item.askedBy || item.user?._id || item.user;
        return currentAskedById === askedById;
      });

      chats.sort(
        (a, b) => new Date(a.questionDate || a.createdAt) - new Date(b.questionDate || b.createdAt)
      );

      setConversation(chats);
    } catch (error) {
      console.error("Error al cargar conversación:", error);
      setConversation([]);
      setVehicle(null);
    } finally {
      setLoading(false);
    }
  };

  const loadAllChats = async () => {
    try {
      setLoading(true);

      const [myQuestionsData, myVehicleQuestionsData] = await Promise.all([
        getMyQuestions(),
        getMyVehicleQuestions(),
      ]);

      const sent = myQuestionsData.data || [];
      const received = myVehicleQuestionsData.data || [];
      const merged = [...received, ...sent];

      const groupedMap = new Map();

      merged.forEach((item) => {
        const currentVehicleId = item.vehicle?._id || item.vehicle;
        const currentAskedById =
          item.askedBy?._id || item.askedBy || item.user?._id || item.user;

        if (!currentVehicleId || !currentAskedById) return;

        const key = `${currentVehicleId}-${currentAskedById}`;
        const currentDate = new Date(item.questionDate || item.createdAt);

        if (!groupedMap.has(key)) {
          groupedMap.set(key, item);
        } else {
          const existing = groupedMap.get(key);
          const existingDate = new Date(existing.questionDate || existing.createdAt);

          if (currentDate > existingDate) {
            groupedMap.set(key, item);
          }
        }
      });

      const result = Array.from(groupedMap.values()).sort(
        (a, b) =>
          new Date(b.questionDate || b.createdAt) -
          new Date(a.questionDate || a.createdAt)
      );

      setAllChats(result);
    } catch (error) {
      console.error("Error al cargar chats:", error);
      setAllChats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      alert("Debes iniciar sesión para ver tus chats.");
      navigate("/login");
      return;
    }

    if (vehicleId && askedById) {
      loadConversationByVehicle();
    } else {
      loadAllChats();
    }
  }, [vehicleId, askedById, navigate, token]);

  const handleSendQuestion = async () => {
    if (!vehicleId) {
      alert("No se encontró el vehículo para enviar la pregunta.");
      return;
    }

    if (!questionText.trim()) {
      alert("La pregunta no puede estar vacía.");
      return;
    }

    try {
      await createQuestion(vehicleId, questionText);
      setQuestionText("");
      await loadConversationByVehicle();
    } catch (error) {
      alert(error.response?.data?.message || "Error al enviar pregunta.");
    }
  };

  const handleSendAnswer = async (questionId, fromList = false) => {
    const answer = answerTexts[questionId];

    if (!answer || !answer.trim()) {
      alert("La respuesta no puede estar vacía.");
      return;
    }

    try {
      await answerQuestion(questionId, answer);

      setAnswerTexts((prev) => ({
        ...prev,
        [questionId]: "",
      }));

      if (fromList) {
        await loadAllChats();
      } else {
        await loadConversationByVehicle();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error al responder.");
    }
  };

  const handleDeleteChat = async (vehicleIdToDelete, askedByIdToDelete) => {
    if (!vehicleIdToDelete || !askedByIdToDelete) {
      alert("No se pudo eliminar el chat porque faltan datos.");
      return;
    }

    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este chat y todo su historial?"
    );

    if (!confirmDelete) return;

    try {
      await deleteChatConversation(vehicleIdToDelete, askedByIdToDelete);

      if (vehicleId && askedById) {
        navigate("/chat");
      } else {
        setAllChats((prev) =>
          prev.filter((item) => {
            const currentVehicleId = item.vehicle?._id || item.vehicle;
            const currentAskedById =
              item.askedBy?._id || item.askedBy || item.user?._id || item.user;

            return !(
              currentVehicleId === vehicleIdToDelete &&
              currentAskedById === askedByIdToDelete
            );
          })
        );
      }

      alert("Chat eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar chat:", error);
      alert(error.response?.data?.message || "Error al eliminar el chat.");
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Cargando chat...</div>;
  }

  if (!vehicleId || !askedById) {
    return (
      <div className="min-h-screen bg-slate-100 px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-3xl font-bold text-slate-900">
            Chat con usuarios
          </h1>

          {allChats.length === 0 ? (
            <p className="text-slate-600">No tienes conversaciones todavía.</p>
          ) : (
            <div className="space-y-4">
              {allChats.map((item) => {
                const currentVehicleId = item.vehicle?._id || item.vehicle;
                const currentAskedById =
                  item.askedBy?._id || item.askedBy || item.user?._id || item.user;

                const vehicleTitle =
                  item.vehicle?.title ||
                  `${item.vehicle?.brand || ""} ${item.vehicle?.model || ""}`.trim() ||
                  "Vehículo";

                const userName = item.askedBy
                  ? `${item.askedBy.name || ""} ${item.askedBy.lastName || ""}`.trim()
                  : item.user
                  ? `${item.user.name || ""} ${item.user.lastName || ""}`.trim()
                  : "No disponible";

                const isOwner =
                  user?._id &&
                  item.vehicle?.user?._id &&
                  user._id === item.vehicle.user._id;

                return (
                  <div
                    key={`${currentVehicleId}-${currentAskedById}-${item._id}`}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <p className="font-semibold text-slate-900">
                      Vehículo: {vehicleTitle}
                    </p>

                    <p className="mt-2 text-slate-700">
                      <span className="font-semibold">Usuario:</span> {userName}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      {item.questionDate || item.createdAt
                        ? new Date(item.questionDate || item.createdAt).toLocaleString()
                        : ""}
                    </p>

                    <p className="mt-2 text-slate-700">
                      <span className="font-semibold">Último mensaje:</span>{" "}
                      {item.question || "Sin mensaje"}
                    </p>

                    {item.answer ? (
                      <p className="mt-2 text-slate-700">
                        <span className="font-semibold">Última respuesta:</span>{" "}
                        {item.answer}
                      </p>
                    ) : (
                      <>
                        <p className="mt-2 text-amber-600">Pendiente de respuesta</p>

                        {isOwner && (
                          <div className="mt-4">
                            <textarea
                              value={answerTexts[item._id] || ""}
                              onChange={(e) =>
                                setAnswerTexts((prev) => ({
                                  ...prev,
                                  [item._id]: e.target.value,
                                }))
                              }
                              placeholder="Escribe tu respuesta..."
                              rows="3"
                              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />

                            <button
                              onClick={() => handleSendAnswer(item._id, true)}
                              className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
                            >
                              Responder
                            </button>
                          </div>
                        )}
                      </>
                    )}

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          if (!currentVehicleId || !currentAskedById) {
                            alert("No se puede abrir esta conversación.");
                            return;
                          }

                          navigate(
                            `/chat?vehicleId=${currentVehicleId}&askedBy=${currentAskedById}`
                          );
                        }}
                        className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                      >
                        Ver conversación
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteChat(currentVehicleId, currentAskedById)
                        }
                        className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                      >
                        Eliminar chat
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="p-10 text-center text-slate-600">
        No se encontró la conversación del vehículo.
      </div>
    );
  }

  const isOwner = user?._id === vehicle.user?._id;
  const lastMessage =
    conversation.length > 0 ? conversation[conversation.length - 1] : null;

  const canAsk = !isOwner && (!lastMessage || !!lastMessage.answer);
  const canAnswer = isOwner && lastMessage && !lastMessage.answer;

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-lg">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-slate-900">
              Chat con usuarios
            </h1>
            <p className="text-slate-600">
              Vehículo: <span className="font-semibold">{vehicle.title}</span>
            </p>
          </div>

          <button
            onClick={() => handleDeleteChat(vehicleId, askedById)}
            className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          >
            Eliminar chat
          </button>
        </div>

        {!isOwner && (
          <div className="mb-8">
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Escribe tu mensaje al vendedor"
              rows="4"
              disabled={!canAsk}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            {!canAsk && (
              <p className="mt-2 text-sm text-amber-600">
                Debes esperar la respuesta del vendedor antes de enviar otro
                mensaje.
              </p>
            )}

            <button
              onClick={handleSendQuestion}
              disabled={!canAsk}
              className={`mt-4 rounded-xl px-5 py-3 font-semibold text-white ${
                canAsk
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-slate-400"
              }`}
            >
              Enviar mensaje
            </button>
          </div>
        )}

        {conversation.length === 0 ? (
          <p className="text-slate-600">
            Aún no hay mensajes para este vehículo.
          </p>
        ) : (
          <div className="space-y-6">
            {conversation.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <div className="mb-2">
                  <p className="font-semibold text-slate-900">
                    {item.askedBy?.name} {item.askedBy?.lastName}
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date(item.questionDate || item.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 p-4 text-slate-800">
                  {item.question}
                </div>

                {item.answer ? (
                  <div className="mt-4">
                    <p className="mb-2 font-semibold text-slate-900">
                      Respuesta del vendedor
                    </p>
                    <div className="rounded-xl bg-blue-50 p-4 text-slate-800">
                      {item.answer}
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                      {item.answerDate
                        ? new Date(item.answerDate).toLocaleString()
                        : ""}
                    </p>
                  </div>
                ) : isOwner && canAnswer && item._id === lastMessage?._id ? (
                  <div className="mt-4">
                    <textarea
                      value={answerTexts[item._id] || ""}
                      onChange={(e) =>
                        setAnswerTexts((prev) => ({
                          ...prev,
                          [item._id]: e.target.value,
                        }))
                      }
                      placeholder="Escribe tu respuesta"
                      rows="3"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />

                    <button
                      onClick={() => handleSendAnswer(item._id)}
                      className="mt-3 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
                    >
                      Responder
                    </button>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-amber-600">
                    Pendiente de respuesta del vendedor.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;