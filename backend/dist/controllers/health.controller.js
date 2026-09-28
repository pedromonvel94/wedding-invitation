import healthService from "../services/health.service.js";
function healthCheck(req, res) {
    const result = healthService.getServerStatus();
    res.status(200).json(result);
}
export default { healthCheck };
